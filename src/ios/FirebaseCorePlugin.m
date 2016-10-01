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

@end