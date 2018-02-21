#import "FirebaseCorePlugin.h"
@import Firebase;

@implementation FirebaseCorePlugin

- (void)initialize:(CDVInvokedUrlCommand *)command {

    NSDictionary *options = [command argumentAtIndex:0];
    NSString *name = [command argumentAtIndex:1];

    if(![FIRApp defaultApp]) {
        [FIRApp configure];
    }

    self.eventCallbackId = command.callbackId;
}

- (void)setUserId:(CDVInvokedUrlCommand *)command {

    NSString *id = [command argumentAtIndex:0];

    [FIRAnalytics setUserID:id];
}

- (void)setUserProperty:(CDVInvokedUrlCommand *)command {

    NSString *name = [command argumentAtIndex:0];
    NSString *value = [command argumentAtIndex:1];

    [FIRAnalytics setUserPropertyString:value forName:name];
}

- (void)logEvent:(CDVInvokedUrlCommand *)command {

    NSString *name = [command argumentAtIndex:0];
    NSDictionary *parameters = [command argumentAtIndex:1 withDefault:@{} andClass:[NSDictionary class]];

    [FIRAnalytics logEventWithName:name parameters:parameters];
}

@end