var fs = require('fs');
var crypto = require('crypto');
var xcode = require('xcode');
var plist = require('plist');
var et = require('elementtree');
var shell = require('shelljs');
var path = require('path');


module.exports = function (context) {

    // only execute for android
    if (!forPlatform('android')) return;

    var appPackage = getConfigParser(context, 'config.xml').packageName();
    var rootPath = context.opts.projectRoot;
    const usesNewStructure = fs.existsSync(path.join(rootPath, 'platforms', 'android', 'app'));
    const baseDestPath = usesNewStructure ? path.join(rootPath, 'platforms', 'android', 'app', 'src', 'main') : path.join(rootPath, 'platforms', 'android');
    var googleServicesJsonSrcPath = path.join(rootPath, 'google-services.json');
    var googleServicesJsonDestPath = path.join(baseDestPath, 'google-services.json');
    var googleServicesJsonExists = fs.existsSync(googleServicesJsonSrcPath);
    var outputXmlPath = path.join(baseDestPath, 'res', 'values', 'google-services.xml');
    var googleServicesJsonChanged = filesDiffer(googleServicesJsonSrcPath, googleServicesJsonDestPath);

    if (googleServicesJsonExists && googleServicesJsonChanged) {
        updateStringsXml();
        console.log('Copying google-services.json');
        shell.cp(googleServicesJsonSrcPath, googleServicesJsonDestPath);
    }

    function findClientId(client) {

        var oAuthEntries = client.oauth_client;
        var i;

        if(oAuthEntries) {
            for (i = 0; i < oAuthEntries.length; i++) {

                if (oAuthEntries[i].client_type === 3) {
                    return oAuthEntries[i].client_id;
                }
            }
        }

        // this should never happen
        return '';
    }

    function updateStringsXml() {

        var config = findAppConfig();
        var client = config.client;
        var project = config.project;
        var clientId = findClientId(client);

        if (!client) {
            console.error('Client [%s] is not present in google-services.json', appPackage);
            return;
        }

        var xml = [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<resources>'
        ];


        xml.push('<string name="default_web_client_id" translatable="false">' + clientId + '</string>');
        xml.push('<string name="firebase_database_url" translatable="false">' + project.firebase_url + '</string>');
        xml.push('<string name="gcm_defaultSenderId" translatable="false">' + project.project_number + '</string>');
        xml.push('<string name="google_api_key" translatable="false">' + client.api_key[0].current_key + '</string>');
        xml.push('<string name="google_app_id" translatable="false">' + client.client_info.mobilesdk_app_id + '</string>');
        xml.push('<string name="google_crash_reporting_api_key" translatable="false">' + client.api_key[0].current_key + '</string>');
        xml.push('<string name="google_storage_bucket" translatable="false">' + project.storage_bucket + '</string>');

        xml.push('</resources>');

        var content = xml.join('\n');
        fs.writeFileSync(outputXmlPath, content, 'utf8');
    }

    function findAppConfig() {

        var config = JSON.parse(fs.readFileSync(googleServicesJsonSrcPath, 'utf8'));
        var clients = config.client;
        var client = false;
        var i;

        if(clients) {
            for (i = 0; i < clients.length; i++) {

                if (clients[i].client_info.android_client_info.package_name === appPackage) {
                    client = clients[i];
                    break;
                }
            }
        }

        return {
            project: config.project_info,
            client: client
        };
    }

    function forPlatform(platform) {

        return context.opts.platforms.indexOf(platform) > -1;
    }

    function filesDiffer(a, b) {

        var aExists = fs.existsSync(a);
        var bExists = fs.existsSync(b);

        return !aExists || !bExists || hash(a) !== hash(b);
    }

    function hash(file) {

        var content = fs.readFileSync(file, 'utf8');
        return crypto.createHash('md5').update(content).digest('hex');
    }

    function getConfigParser(context, config) {
        var ConfigParser = require('cordova-common').ConfigParser;
        return new ConfigParser(config);
    }

};
