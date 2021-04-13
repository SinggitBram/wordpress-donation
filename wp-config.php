<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'donation' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', '' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/** INI SUPAYA BISA INSTALL THEME KETIK INI DI WP-CONFIG.PHP*/
define('FS_METHOD','direct');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '[$Tx*r^3N(<.I_2E--&`y0VnzJM4nk5W@~Yw)irL6r(I6*u<q^9!ItgcJW_dW`S4' );
define( 'SECURE_AUTH_KEY',  '$>l>L_& <X=uU]lFx,E)t6|p{o|g`o9Q(n3HjEr Zh8pBBRN-4wVG&Aj}9L@w_Bb' );
define( 'LOGGED_IN_KEY',    'OAeiDNCo6pq2^SCr~T%v-kt|.JB l;ZCCpDP^+$NBotBe}th8`XqIuQF*MiwwasB' );
define( 'NONCE_KEY',        ':Q3uV bE`h%.C^FCe/jNkId/*(x0ie.%FiQ]2t&c9x~5@zdlyBQ/daba!uaBuHOW' );
define( 'AUTH_SALT',        '6zz6~LE.+#c6_.#Mv>;iq?Ku(7p;*kGYulM<ln`]X{EssR3D_eKqfgfE(`TEw)|D' );
define( 'SECURE_AUTH_SALT', 'K#X%TfO#Aa/)Rt4!Knr<7AnVY2)ic14e~yC@|inN|jcmo2r`>F d}n|D|Ukn].v#' );
define( 'LOGGED_IN_SALT',   'd.Dt8]Ws+8P94T 5*z!g~d2Ex:B]?V_cR~(`v!xg9aFIk^*6F,R[;e]ChbLE9bw(' );
define( 'NONCE_SALT',       'Dx#R1;P-3d{$Z5wt8!3AWdy=1wf[:IIE $JAoiqZL{n;ISUbLF|3KNL%g-wx@nvS' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
