// wc_midtrans var is passed from payment-page backend via inline script.

var payButton = document.getElementById("pay-button");

document.addEventListener("DOMContentLoaded", function(event) { 
  function MixpanelTrackResult(token, merchant_id, cms_name, cms_version, plugin_name, plugin_version, status, result) {
    var eventNames = {
      pay: 'pg-pay',
      success: 'pg-success',
      pending: 'pg-pending',
      error: 'pg-error',
      close: 'pg-close'
    };
    // avoid error when mixpanel undefined
    mixpanel && mixpanel.track(
      eventNames[status], 
      {
        merchant_id: merchant_id,
        cms_name: cms_name,
        cms_version: cms_version,
        plugin_name: plugin_name,
        plugin_version: plugin_version,
        snap_token: token,
        payment_type: result ? result.payment_type: null,
        order_id: result ? result.order_id: null,
        status_code: result ? result.status_code: null,
        gross_amount: result && result.gross_amount ? Number(result.gross_amount) : null,
      }
    );
  }
  var SNAP_TOKEN = wc_midtrans.snap_token;
  var MERCHANT_ID = wc_midtrans.merchant_id;
  var CMS_NAME = "woocommerce";
  var CMS_VERSION = wc_midtrans.wc_version;
  var PLUGIN_NAME = wc_midtrans.plugin_name;
  var PLUGIN_VERSION = wc_midtrans.midtrans_plugin_version;
  function loadExtScript(src,tagId) {
    // if snap.js is loaded from html script tag, don't load again
    if (document.getElementById(tagId))
      return;
    // Append script to doc
    var s = document.createElement("script");
    s.src = src;
    a = document.body.appendChild(s);
    a.setAttribute('id',tagId);
    a.setAttribute('data-client-key',wc_midtrans.client_key);
    a.setAttribute('data-cfasync','false');
  }

  var retryCount = 0;
  var snapExecuted = false;
  var intervalFunction = 0;
  // Continously retry to execute SNAP popup if fail, with 1000ms delay between retry
  function execSnapCont(ccDetails){
    intervalFunction = setInterval(function() {
      try{
        snap.pay(SNAP_TOKEN, 
        {
          creditCardNumber: ccDetails ? ccDetails.creditCardNumber : '',
          creditCardCvv: ccDetails ? ccDetails.creditCardCvv : '',
          creditCardExpiry: ccDetails ? ccDetails.creditCardExpiry : '',
          customerEmail: ccDetails ? ccDetails.customerEmail : '',
          customerPhone: ccDetails ? ccDetails.customerPhone : '',
          skipOrderSummary : true,
          onSuccess: function(result){
            MixpanelTrackResult(SNAP_TOKEN, MERCHANT_ID, CMS_NAME, CMS_VERSION, PLUGIN_NAME, PLUGIN_VERSION, 'success', result);
            // console.log(result?result:'no result');
            payButton.innerHTML = "Loading...";

            if(wc_midtrans.is_using_map_finish_url){
              var finish_url = result.finish_redirect_url;
            } else {
              var finish_url = wc_midtrans.finish_url+"&order_id="+result.order_id+"&status_code="+result.status_code+"&transaction_status="+result.transaction_status;
            }
            window.location = finish_url;
          },
          onPending: function(result){ // on pending, instead of redirection, show PDF instruction link
            MixpanelTrackResult(SNAP_TOKEN, MERCHANT_ID, CMS_NAME, CMS_VERSION, PLUGIN_NAME, PLUGIN_VERSION, 'pending', result);
            // console.log(result?result:'no result');
            
            if (result.fraud_status == 'challenge'){ // if challenge redirect to finish
              payButton.innerHTML = "Loading...";
              window.location = wc_midtrans.finish_url+"&order_id="+result.order_id+"&status_code="+result.status_code+"&transaction_status="+result.transaction_status;
            }

            if(wc_midtrans.is_ignore_pending_status){
              // prevent redirect
              var pending_url = '#';
            } else {
              var pending_url = wc_midtrans.pending_url+"&order_id="+result.order_id+"&status_code="+result.status_code+"&transaction_status="+result.transaction_status;
              // redirect to thank you page
              window.location = pending_url;
            }
            if(result.hasOwnProperty("pdf_url")){
              // Show payment instruction and hide payment button
              document.getElementById('payment-instruction-btn').href = result.pdf_url;
              // document.getElementById('pay-button').style.display = "none";
              document.getElementById('payment-instruction').style.display = "block";
            } else {
              // if no pdf instruction, hide the btn
              document.getElementById('payment-instruction-btn').style.display = "none";
            }
            return 0;
            // Below code is UNUSED
            // Update order with PDF url to backend
            try{
              result['pdf_url_update'] = true;
              result['snap_token_id'] = SNAP_TOKEN;
              fetch(wc_midtrans.plugin_backend_url, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(result)
              });
            }catch(e){ console.log(e); }
          },
          onError: function(result){
            MixpanelTrackResult(SNAP_TOKEN, MERCHANT_ID, CMS_NAME, CMS_VERSION, PLUGIN_NAME, PLUGIN_VERSION, 'error', result);
            // console.log(result?result:'no result');
            payButton.innerHTML = "Loading...";
            window.location = wc_midtrans.error_url+"&order_id="+result.order_id+"&status_code="+result.status_code+"&transaction_status="+result.transaction_status;
          },
          onClose: function(){
            MixpanelTrackResult(SNAP_TOKEN, MERCHANT_ID, CMS_NAME, CMS_VERSION, PLUGIN_NAME, PLUGIN_VERSION, 'close', null);
            // console.log(result?result:'no result');
          }
        });
        snapExecuted = true; // if SNAP popup executed, change flag to stop the retry.
      } catch (e){ 
        retryCount++;
        if(retryCount >= 10){
          location.reload(); payButton.innerHTML = "Loading..."; return;
        }
        console.log(e);
        console.log("Snap not ready yet... Retrying in 1000ms!");
      } finally {
        if (snapExecuted) {
          clearInterval(intervalFunction);
          // record 'pay' event to Mixpanel
          MixpanelTrackResult(SNAP_TOKEN, MERCHANT_ID, CMS_NAME, CMS_VERSION, PLUGIN_NAME, PLUGIN_VERSION, 'pay', null);
        }
      }
    }, 1000);
  };

  var createPaymentRequest = function(){
    var supportedPaymentMethods = [
      {
        supportedMethods: 'basic-card',
        data: {
          supportedNetworks: ['visa', 'mastercard', 'jcb', 'amex'],
        }
      }
    ];
    var paymentDetails = {
      total: {
        label: 'Total',
        amount:{
          currency: 'IDR',
          value: wc_midtrans.gross_amount
        }
      }
    };
    // Options isn't required.
    var options = {  
      requestPayerName: false,
      requestPayerPhone: true,
      requestPayerEmail: true,
    };

    return  new PaymentRequest(
      supportedPaymentMethods,
      paymentDetails,
      options
    );
  };

  // ENTRY POINT
  var clickCount = 0;
  function handlePayAction() {
    if(clickCount >= 2){
      location.reload();
      payButton.innerHTML = "Loading...";
      return;
    }
    var ccDetails = null;
    var isPaymentRequestPlugin = wc_midtrans.is_payment_request_plugin;
    // Check if this is paymentRequest sub-plugin & paymentRequest is supported
    if(isPaymentRequestPlugin && window.PaymentRequest){
        var payRequest = createPaymentRequest();
        payRequest
          .show()
          .then(function(result){
            result.complete('success');
            ccDetails = {
              creditCardNumber: result.details.cardNumber,
              creditCardCvv: result.details.cardSecurityCode,
              creditCardExpiry: 
                result.details.expiryMonth+'/'+result.details.expiryYear.slice(-2),
              customerEmail: result.payerEmail,
              customerPhone: result.payerPhone,
            };
            console.log('Browser Payment Request Completed!, passing to Snap');
            execSnapCont(ccDetails);
          })
          .catch(function(err){
            console.log('- Failed Browser Payment Request!, fallback to regular Snap');
            execSnapCont(ccDetails);
          })
    } else {
      execSnapCont(ccDetails);
    }
    clickCount++;
  };

  console.log("Loading snap JS library now!");
  
  // In case snap.js script tag is not exist, load scrip tag dynamically
  loadExtScript(wc_midtrans.snap_script_url, wc_midtrans.snap_script_tag_id);
  console.log("Snap library is loaded now");

  payButton.onclick = handlePayAction;

  handlePayAction();
  payButton.innerHTML = "Proceed To Payment";
});