How to build the Weather App Demo
=================================

The Weather App Demo is built using `Trigger.io` <https://trigger.io>, here are the steps to build and test this app on a Mac in the iOS emulator.

The steps to test on Windows / Android are similar and you can find more information here on `Getting started with Trigger.io` <http://current-docs.trigger.io/getting-started/index.html>.

Install the Trigger.io Toolkit
-------------------------------

1. Install the toolkit from https://trigger.io/forge/toolkit
2. Start the Toolkit and create an account
3. Create a new app and note the app directory

Getting the code
----------------

1. Open a terminal and navigate to your app directory.
2. Move your identity.json file away and remove the template contents in the src directory:

   * cd src
   * mv identity.json ..
   * rm -rf *

3. Checkout this repository and move the identity.json file back:

   * git clone git@pdihub.hi.inet:jcu30/diario-triggerio.git
   * cd ..
   * mv identity.json src/

Running the app
---------------

1. In the Toolkit, click on the app name to build it. The first time this will take a minute or so, subsequent incremental builds will be very fast.

2. Then click 'iOS' in the Run section of the app page. You'll see the full console output there and the iPhone emulator will start up in a few seconds.

Testing the app
---------------

The app requires a working Weather Underground API key. Instructions on how to set this up are here: <http://docs.trigger.io/en/v1.4/tutorials/weather/tutorial-1.html#preparation>