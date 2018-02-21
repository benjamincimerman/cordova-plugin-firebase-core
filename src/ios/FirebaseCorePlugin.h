#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>

@interface FirebaseCorePlugin : CDVPlugin

- (void)initialize:(CDVInvokedUrlCommand *)command;
- (void)logEvent:(CDVInvokedUrlCommand *)command;
- (void)setUserId:(CDVInvokedUrlCommand *)command;
- (void)setUserProperty:(CDVInvokedUrlCommand *)command;
@property (nonatomic) NSString *eventCallbackId;
@end
