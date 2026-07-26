# Firefox about:config Menu Shortcut

Add a menu button on toolbar, which is shortcut to change settings in `about:config`.

Firefox userChrome script. Tested on Firefox 153.

![](https://preview.redd.it/onmgncgvb3j71.png?width=621&format=png&auto=webp&s=b99bab85467a891846da05593b4f9279f70ea789)

**You should open/edit the code and define your items.** 

Defaultly this script includes:

- DOM clipboard events enable/disable
- IPv6 enable/disable
- DNS related setting
- Enable/disable deprecated TLS version
- Autoplay policy
- WebAudio enable/disable
- Resisting fingerprint (also webExtension addons recommend: [Toggle Resist Fingerprinting](https://github.com/Aaron-P/ToggleResistFingerprinting) and  [Toggle Web Custom Font](https://github.com/garywill/toggleWebCustomFont) )
- Some locale language and font related settings
- HTTP referer control ( despite this, recommend webExtension addon [Auto Referer](https://github.com/garywill/autoreferer) )
- Browser Toolbox connecting confirm

----------------

This repo only contains the specific function, doesn't contain the code to enable userchrome scripts.

**For how to enable, see: (also more of my scripts)**

https://garywill.github.io/#Firefox-userChrome-CSS-or-JS
