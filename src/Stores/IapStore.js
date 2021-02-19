import {decorate, observable} from 'mobx';
import {Alert} from 'react-native';
import Iaphub from 'react-native-iaphub';
import autobind from 'autobind-decorator';

@autobind
export default class IAPStore {

	@observable isInitialized = false;
	@observable skuProcessing = null;
	@observable user = null;
  @observable products = null;

	constructor(){
    this.init();
  }

	// Init IAPHUB
	async init() {
		try {
			// Init iaphub
			await Iaphub.init({
				// The app id is available on the settings page of your app
				appId: "5ea6317e11cda30e967170d0",
				// The (client) api key is available on the settings page of your app
				apiKey: "gkAXzRXj1N3uBAGE2Fp26UgSbOxalvL2",
				// The environment is used to determine the webhooks configuration ('production', 'staging', 'development')
				environment: "production"
			});
			// Iaphub is now initialized and ready to use
			this.isInitialized = true;
		} catch (err) {
			console.error(err);
			// The init has failed (the error code is available in the 'err.code' property)
			// You probably forgot to specify an option (appId, apiKey...)
			// Or the user is not allowed to make payments, IOS only (Error code: 'billing_disabled')
			// Or the billing system is unavailable, it may be a problem with the device or Itunes/Play Store is down (Error code: 'billing_unavailable')
			// Or it is an unknown error, probably the native library of react-native-iap that is not installed properly (Error code: 'billing_error')
		}
	}

	// Login user
	async login(userId) {
		// Login with user id
		Iaphub.login(userId);
		// Get the user
		this.user = await Iaphub.getUser();
	}

	// Logout user
	logout() {
		Iaphub.logout();
	}

	// Call this method when an user click on one of your products
	async buy(productSku) {
		try {
			this.skuProcessing = productSku;
			var transaction = await Iaphub.buy(productSku);
			this.skuProcessing = null;
			// The webhook could not been sent to my server
			if (transaction.webhookStatus == "failed") {
				Alert.alert(
					"Purchase delayed",
					"Your purchase was successful but we need some more time to validate it, should arrive soon! Otherwise contact the support (support@parceled.co)"
				);
			}
			// Everything was successful! Yay!
			else {
				Alert.alert(
					"Purchase successful",
					"Your purchase has been processed successfully!"
				);
			}
			// Refresh the user to update the products for sale
			try {
				this.user = await Iaphub.getUser();
			} catch (err) {
				console.error(err);
			}
		} catch (err) {
			this.skuProcessing = null;
			// Purchase popup cancelled by the user (ios only)
			if (err.code == "user_cancelled") return
			// Couldn't buy product because it has been bought in the past but hasn't been consumed (restore needed)
			else if (err.code == "product_already_owned") {
				Alert.alert(
					"Product already owned",
					"Please restore your purchases in order to fix that issue",
					[
						{text: 'Cancel', style: 'cancel'},
						{text: 'Restore', onPress: () => Iaphub.restore()}
					]
				);
			}
			// The receipt has been processed on IAPHUB but something went wrong
			else if (err.code == "receipt_validation_failed") {
				Alert.alert(
					"We're having trouble validating your transaction",
					"Give us some time, we'll retry to validate your transaction ASAP!"
				);
			}
			// The receipt hasn't been validated on IAPHUB (Could be an issue like a network error...)
			else if (err.code == "receipt_request_failed") {
				Alert.alert(
					"We're having trouble validating your transaction",
					"Please try to restore your purchases later (Button in the settings) or contact the support (support@parceled.co)"
				);
			}
			// Couldn't buy product for many other reasons (the user shouldn't be charged)
			else {
				Alert.alert(
					"Purchase error",
					"We were not able to process your purchase, please try again later or contact the support (support@parceled.co)"
				);
			}
		}
	}

	// Call this method to restore the user purchases (you should have a button, it is usually displayed on the settings page)
	async restore() {
		var restoredPurchases = await Iaphub.restore();

		Alert.alert("Restore", `${restoredPurchases.length} purchases restored`);
	}

}
