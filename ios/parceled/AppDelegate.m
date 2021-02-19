/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "RNSplashScreen.h"
#import "Intercom/intercom.h"
#import <RNBranch/RNBranch.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Parceled"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // Intercom
  [Intercom setApiKey:@"ios_sdk-22cbaffeb90fb286dbe17febf2bb9dd4fbc7d2d4" forAppId:@"ktlujjy1"];
  
  //Branch Metrics
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  
  [RNNotifications startMonitorNotifications];
  [RNSplashScreen show];
  return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    UNUserNotificationCenter *notificationCenter = [UNUserNotificationCenter currentNotificationCenter];
    [notificationCenter requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge) completionHandler:^(BOOL granted, NSError * _Nullable error) {
       [application registerForRemoteNotifications];
    }];
}


- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
    return YES;
  }
  if ([RNBranch application:app openURL:url options:options])  {
    
  }

  //if ([RCTLinkingManager application:app openURL:url options:options]) {
  //  return YES;
  //}

  return NO;
}

/*- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *, id> *) options {
  return [self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:url];
}*/


- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  
    #if TARGET_IPHONE_SIMULATOR
  
        NSLog(@"Running in Simulator - no app store or giro");
  
    #else
  
        NSLog(@"Running on the Device");
        [RNNotifications didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
    #endif
  // Intercom
  [Intercom setDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  
 
  #if TARGET_IPHONE_SIMULATOR

      NSLog(@"Running in Simulator - no app store or giro");

  #else

      NSLog(@"Running on the Device");
      [RNNotifications didFailToRegisterForRemoteNotificationsWithError:error];

  #endif
}



- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
