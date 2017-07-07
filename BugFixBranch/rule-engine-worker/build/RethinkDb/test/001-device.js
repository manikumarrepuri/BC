
"use strict";

var r        = require("itheon-data-provider").rethinkDbDataProvider.getRethinkDbDataProvider();
const config = require("opserve-common").Config.get();
var replicas = config.get("rethinkdb:replicas");

module.exports = r.tableCreate("Device", {replicas: replicas}).then(function() {

  return r.table("Device")
    .indexCreate("deviceId", [r.row("name"), r.row("group")]).run();

}).then(function() {

  var devices = [
    {
      "id": "Bluechip:Generic",
      "name": "Generic",
      "group": "Bluechip",
      "displayName": "Generic Bluechip Machine"
    },
    {
      "createdAt":  "2015-09-23T09:24:43.235Z",
      "id":  "AJ Bell::BCC-AJH-HT-01:BCC-AJH-HT-01",
      "group":  "AJ Bell::BCC-AJH-HT-01",
      "name":  "BCC-AJH-HT-01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:43.238Z",
      "id":  "AJ Bell::BCC-AJH-TC-03:BCC-AJH-TC-03",
      "group":  "AJ Bell::BCC-AJH-TC-03",
      "name":  "BCC-AJH-TC-03",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:43.240Z",
      "id":  "AJ Bell::BCC-AJH-TC-05:BCC-AJH-TC-05",
      "group":  "AJ Bell::BCC-AJH-TC-05",
      "name":  "BCC-AJH-TC-05",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:42.169Z",
      "id":  "BC MS::rstsslive:rstsslive",
      "group":  "BC MS::rstsslive",
      "name":  "rstsslive",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.514Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:43.514Z",
      "id":  "Kier::Lpar2:Lpar2",
      "group":  "Kier::Lpar2",
      "name":  "Lpar2",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.514Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:42.641Z",
      "id":  "Miki Travel::EBZ04:EBZ04",
      "group":  "Miki Travel::EBZ04",
      "name":  "EBZ04",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:41.805Z",
      "id":  "Miki Travel::PRLCXLWEB04:PRLCXLWEB04",
      "group":  "Miki Travel::PRLCXLWEB04",
      "name":  "PRLCXLWEB04",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:43.148Z",
      "id":  "Smiths News::newsvio2a:newsvio2a",
      "group":  "Smiths News::newsvio2a",
      "name":  "newsvio2a",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:43.130Z",
      "id":  "Societe Generale::BCC-SGU-MD-01:BCC-SGU-MD-01",
      "group":  "Societe Generale::BCC-SGU-MD-01",
      "name":  "BCC-SGU-MD-01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:41.950Z",
      "id":  "UMGi::UKBCEWVAPP034:UKBCEWVAPP034",
      "group":  "UMGi::UKBCEWVAPP034",
      "name":  "UKBCEWVAPP034",
      "platform":  "windows",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:42.864Z",
      "id":  "britishcarauctions::SERVERC:SERVERC",
      "group":  "britishcarauctions::SERVERC",
      "name":  "SERVERC",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:41.690Z",
      "id":  "nlnnwadb02:nlnnwadb02",
      "group":  "nlnnwadb02",
      "name":  "nlnnwadb02",
      "platform":  "linux",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:42.613Z",
      "id":  "AJ Bell::AJBPROD:AJBPROD",
      "group":  "AJ Bell::AJBPROD",
      "name":  "AJBPROD",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:43.274Z",
      "id":  "AJ Bell::BCA-AJP-LD-01:BCA-AJP-LD-01",
      "group":  "AJ Bell::BCA-AJP-LD-01",
      "name":  "BCA-AJP-LD-01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:43.231Z",
      "id":  "AJ Bell::BCC-AJH-TC-01:BCC-AJH-TC-01",
      "group":  "AJ Bell::BCC-AJH-TC-01",
      "name":  "BCC-AJH-TC-01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:42.881Z",
      "id":  "BCA-AJT-TC-01:BCA-AJT-TC-01",
      "group":  "BCA-AJT-TC-01",
      "name":  "BCA-AJT-TC-01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:42.000Z",
      "id":  "Fibi Bank::FIBISQL01:FIBISQL01",
      "group":  "Fibi Bank::FIBISQL01",
      "name":  "FIBISQL01",
      "platform":  "windows",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:42.137Z",
      "id":  "Greenhams::BCHSTS03:BCHSTS03",
      "group":  "Greenhams::BCHSTS03",
      "name":  "BCHSTS03",
      "platform":  "windows",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:42.526Z",
      "id":  "Jarvis::JRVPROD:JRVPROD",
      "group":  "Jarvis::JRVPROD",
      "name":  "JRVPROD",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:42.426Z",
      "id":  "Miki Travel::EBZ03:EBZ03",
      "group":  "Miki Travel::EBZ03",
      "name":  "EBZ03",
      "platform":  "ibm",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.354Z",
      "id":  "Miki Travel::EBZLVE01:EBZLVE01",
      "group":  "Miki Travel::EBZLVE01",
      "name":  "EBZLVE01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.354Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.953Z",
      "id":  "Miki Travel::MSI1:MSI1",
      "group":  "Miki Travel::MSI1",
      "name":  "MSI1",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.815Z",
      "id":  "Nisa::ACCPRD01:ACCPRD01",
      "group":  "Nisa::ACCPRD01",
      "name":  "ACCPRD01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.815Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.450Z",
      "id":  "UMG::CATOAS01:CATOAS01",
      "group":  "UMG::CATOAS01",
      "name":  "CATOAS01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.815Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.637Z",
      "id":  "britishcarauctions::HINDHEAD:HINDHEAD",
      "group":  "britishcarauctions::HINDHEAD",
      "name":  "HINDHEAD",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.501Z",
      "id":  "britishcarauctions::SERVERB2:SERVERB2",
      "group":  "britishcarauctions::SERVERB2",
      "name":  "SERVERB2",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.328Z",
      "id":  "britishcarauctions::SERVERU2:SERVERU2",
      "group":  "britishcarauctions::SERVERU2",
      "name":  "SERVERU2",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.516Z",
      "id":  "BC I-Series::BLUE520A:BLUE520A",
      "group":  "BC I-Series::BLUE520A",
      "name":  "BLUE520A",
      "platform":  "ibm",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.228Z",
      "id":  "BC MS::bca-msntp-01:bca-msntp-01",
      "group":  "BC MS::bca-msntp-01",
      "name":  "bca-msntp-01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "displayName":  "Generic Bluechip Machine",
      "id":  "Bluechip:Generic",
      "group":  "Bluechip",
      "name":  "Generic"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.174Z",
      "id":  "Harvey Nichols::HNIC01:HNIC01",
      "group":  "Harvey Nichols::HNIC01",
      "name":  "HNIC01",
      "platform":  "ibm",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.551Z",
      "id":  "Miki Travel::EBZ01:EBZ01",
      "group":  "Miki Travel::EBZ01",
      "name":  "EBZ01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.331Z",
      "id":  "Miki Travel::EBZSRCHD:EBZSRCHD",
      "group":  "Miki Travel::EBZSRCHD",
      "name":  "EBZSRCHD",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:43.298Z",
      "id":  "Miki Travel::PRLCXLWEB01:PRLCXLWEB01",
      "group":  "Miki Travel::PRLCXLWEB01",
      "name":  "PRLCXLWEB01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.609Z",
      "id":  "NAMPAK::GBDC1DMS02V:GBDC1DMS02V",
      "group":  "NAMPAK::GBDC1DMS02V",
      "name":  "GBDC1DMS02V",
      "platform":  "windows",
      "updatedAt": "2015-09-23T09:24:43.815Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.399Z",
      "id":  "Surecomp::BCA-SC-DB-01:BCA-SC-DB-01",
      "group":  "Surecomp::BCA-SC-DB-01",
      "name":  "BCA-SC-DB-01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.407Z",
      "id":  "Telecomputing Norrkoping::NKPG:NKPG",
      "group":  "Telecomputing Norrkoping::NKPG",
      "name":  "NKPG",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.354Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.539Z",
      "id":  "britishcarauctions::ADTSERVB:ADTSERVB",
      "group":  "britishcarauctions::ADTSERVB",
      "name":  "ADTSERVB",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.046Z",
      "id":  "britishcarauctions::SERVERD:SERVERD",
      "group":  "britishcarauctions::SERVERD",
      "name":  "SERVERD",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.780Z",
      "id":  "BCA-AJP-HT-01:BCA-AJP-HT-01",
      "group":  "BCA-AJP-HT-01",
      "name":  "BCA-AJP-HT-01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
      {
      "createdAt":  "2015-09-23T09:24:43.158Z",
        "id":  "Cheviot::BCA-CH-LD-01:BCA-CH-LD-01",
        "group":  "Cheviot::BCA-CH-LD-01",
        "name":  "BCA-CH-LD-01",
        "platform":  "question",
        "updatedAt": "2015-09-23T09:24:43.238Z"
      },
    {
    "createdAt":  "2015-09-23T09:24:43.168Z",
      "id":  "Cheviot::BCA-CH-TC-01:BCA-CH-TC-01",
      "group":  "Cheviot::BCA-CH-TC-01",
      "name":  "BCA-CH-TC-01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:43.164Z",
      "id":  "Cheviot::Smiths News::BCA-CH-TC-03:BCA-CH-TC-03",
      "group":  "Cheviot::Smiths News::BCA-CH-TC-03",
      "name":  "BCA-CH-TC-03",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.783Z",
      "id":  "Daniels::DGISERHA:DGISERHA",
      "group":  "Daniels::DGISERHA",
      "name":  "DGISERHA",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.163Z",
      "id":  "Kier::thservitortest01:thservitortest01",
      "group":  "Kier::thservitortest01",
      "name":  "thservitortest01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.354Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.385Z",
      "id":  "Miki Travel::EBZSTAGE:EBZSTAGE",
      "group":  "Miki Travel::EBZSTAGE",
      "name":  "EBZSTAGE",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.169Z",
      "id":  "Miki Travel::MSI8:MSI8",
      "group":  "Miki Travel::MSI8",
      "name":  "MSI8",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.760Z",
      "id":  "Movianto::GBSWMDEV:GBSWMDEV",
      "group":  "Movianto::GBSWMDEV",
      "name":  "GBSWMDEV",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.359Z",
      "id":  "Movianto::GBSWMHA:GBSWMHA",
      "group":  "Movianto::GBSWMHA",
      "name":  "GBSWMHA",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.354Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.197Z",
      "id":  "UMGI::UKBCEWVAPP079:UKBCEWVAPP079",
      "group":  "UMGI::UKBCEWVAPP079",
      "name":  "UKBCEWVAPP079",
      "platform":  "windows",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:41.862Z",
      "id":  "UMGi::UKBCEWVAPP007:UKBCEWVAPP007",
      "group":  "UMGi::UKBCEWVAPP007",
      "name":  "UKBCEWVAPP007",
      "platform":  "windows",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.232Z",
      "id":  "AJ Bell::BCA-AJP-TC-03:BCA-AJP-TC-03",
      "group":  "AJ Bell::BCA-AJP-TC-03",
      "name":  "BCA-AJP-TC-03",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.777Z",
      "id":  "BCA-AJP-TC-02:BCA-AJP-TC-02",
      "group":  "BCA-AJP-TC-02",
      "name":  "BCA-AJP-TC-02",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.771Z",
      "id":  "BCA-AJP-TC-05:BCA-AJP-TC-05",
      "group":  "BCA-AJP-TC-05",
      "name":  "BCA-AJP-TC-05",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.008Z",
      "id":  "Miki Travel::MDEV:MDEV",
      "group":  "Miki Travel::MDEV",
      "name":  "MDEV",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.534Z",
      "id":  "Miki Travel::MIKIHA:MIKIHA",
      "group":  "Miki Travel::MIKIHA",
      "name":  "MIKIHA",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.274Z",
      "id":  "Movianto::SGBBC1PWDB08:SGBBC1PWDB08",
      "group":  "Movianto::SGBBC1PWDB08",
      "name":  "SGBBC1PWDB08",
      "platform":  "windows",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.912Z",
      "id":  "Nisa::ACCDEV01:ACCDEV01",
      "group":  "Nisa::ACCDEV01",
      "name":  "ACCDEV01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.131Z",
      "id":  "Societe Generale::BCC-SGU-LD-01:BCC-SGU-LD-01",
      "group":  "Societe Generale::BCC-SGU-LD-01",
      "name":  "BCC-SGU-LD-01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.489Z",
      "id":  "Telecomputing Trollhattan::TROLL:TROLL",
      "group":  "Telecomputing Trollhattan::TROLL",
      "name":  "TROLL",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:41.712Z",
      "id":  "UMGi::UKBCEWVAPP067:UKBCEWVAPP067",
      "group":  "UMGi::UKBCEWVAPP067",
      "name":  "UKBCEWVAPP067",
      "platform":  "windows",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.529Z",
      "id":  "Bibby::BIBBYPRD:BIBBYPRD",
      "group":  "Bibby::BIBBYPRD",
      "name":  "BIBBYPRD",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.815Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.161Z",
      "id":  "Cheviot::BCA-CH-HT-01:BCA-CH-HT-01",
      "group":  "Cheviot::BCA-CH-HT-01",
      "name":  "BCA-CH-HT-01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.084Z",
      "id":  "Consortium::DEV720:DEV720",
      "group":  "Consortium::DEV720",
      "name":  "DEV720",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.810Z",
      "id":  "Nisa::WMSHA02:WMSHA02",
      "group":  "Nisa::WMSHA02",
      "name":  "WMSHA02",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.815Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.184Z",
      "id":  "Societe Generale::BCA-SGP-TC-02:BCA-SGP-TC-02",
      "group":  "Societe Generale::BCA-SGP-TC-02",
      "name":  "BCA-SGP-TC-02",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.337Z",
      "id":  "Societe Generale::BCC-SGH-LD-01:BCC-SGH-LD-01",
      "group":  "Societe Generale::BCC-SGH-LD-01",
      "name":  "BCC-SGH-LD-01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.721Z",
      "id":  "Telecomputing Kalix::KALIX:KALIX",
      "group":  "Telecomputing Kalix::KALIX",
      "name":  "KALIX",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.177Z",
      "id":  "Wilkinson::GBWILW01:GBWILW01",
      "group":  "Wilkinson::GBWILW01",
      "name":  "GBWILW01",
      "platform":  "ibm",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.732Z",
      "id":  "britishcarauctions::SERVERU:SERVERU",
      "group":  "britishcarauctions::SERVERU",
      "name":  "SERVERU",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.521Z",
      "id":  "britishcarauctions::SERVERX:SERVERX",
      "group":  "britishcarauctions::SERVERX",
      "name":  "SERVERX",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.178Z",
      "id":  "AJ Bell::AJBHA:AJBHA",
      "group":  "AJ Bell::AJBHA",
      "name":  "AJBHA",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.927Z",
      "id":  "BC I-Series::BLUENOTE:BLUENOTE",
      "group":  "BC I-Series::BLUENOTE",
      "name":  "BLUENOTE",
      "platform":  "ibm",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.446Z",
      "id":  "Bertrams::DEV400:DEV400",
      "group":  "Bertrams::DEV400",
      "name":  "DEV400",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.715Z",
      "id":  "Bertrams::DEV400HA:DEV400HA",
      "group":  "Bertrams::DEV400HA",
      "name":  "DEV400HA",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.572Z",
      "id":  "Daniels::DGISER7:DGISER7",
      "group":  "Daniels::DGISER7",
      "name":  "DGISER7",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.710Z",
      "id":  "Imagem::IVES:IVES",
      "group":  "Imagem::IVES",
      "name":  "IVES",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:44.020Z",
      "id":  "Jarvis::JRVHA:JRVHA",
      "group":  "Jarvis::JRVHA",
      "name":  "JRVHA",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.309Z",
      "id":  "Kier::kbmnorth01:kbmnorth01",
      "group":  "Kier::kbmnorth01",
      "name":  "kbmnorth01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.354Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.444Z",
      "id":  "Miki Travel::EBZ02:EBZ02",
      "group":  "Miki Travel::EBZ02",
      "name":  "EBZ02",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
      {
      "createdAt":  "2015-09-23T09:24:42.329Z",
        "id":  "Miki Travel::EBZCLNT:EBZCLNT",
        "group":  "Miki Travel::EBZCLNT",
        "name":  "EBZCLNT",
        "platform":  "ibm",
        "updatedAt": "2015-09-23T09:24:42.613Z"
      },
    {
    "createdAt":  "2015-09-23T09:24:42.303Z",
      "id":  "Miki Travel::EBZDI:EBZDI",
      "group":  "Miki Travel::EBZDI",
      "name":  "EBZDI",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.348Z",
      "id":  "Miki Travel::EBZTST01:EBZTST01",
      "group":  "Miki Travel::EBZTST01",
      "name":  "EBZTST01",
      "platform":  "ibm",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.400Z",
      "id":  "Nippon Express - EURAMSMX::EURAMS:EURAMS",
      "group":  "Nippon Express - EURAMSMX::EURAMS",
      "name":  "EURAMS",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.185Z",
      "id":  "Societe Generale::BCC-SGH-TC-02:BCC-SGH-TC-02",
      "group":  "Societe Generale::BCC-SGH-TC-02",
      "name":  "BCC-SGH-TC-02",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.180Z",
      "id":  "Societe Generale::BCC-SGT-TC-02:BCC-SGT-TC-02",
      "group":  "Societe Generale::BCC-SGT-TC-02",
      "name":  "BCC-SGT-TC-02",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.020Z",
      "id":  "Societe Generale::BCC-SGU-TC-01:BCC-SGU-TC-01",
      "group":  "Societe Generale::BCC-SGU-TC-01",
      "name":  "BCC-SGU-TC-01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:41.680Z",
      "id":  "UMG::USFSH23:USFSH23",
      "group":  "UMG::USFSH23",
      "name":  "USFSH23",
      "platform":  "ibm",
      "updatedAt": "2015-09-23T09:24:41.680Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:42.186Z",
      "id":  "iFORCE::IFORCE:IFORCE",
      "group":  "iFORCE::IFORCE",
      "name":  "IFORCE",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:42.164Z",
      "id":  "Kier::kbmsouth01:kbmsouth01",
      "group":  "Kier::kbmsouth01",
      "name":  "kbmsouth01",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.354Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.528Z",
      "id":  "Miki Travel::MIKILON2:MIKILON2",
      "group":  "Miki Travel::MIKILON2",
      "name":  "MIKILON2",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.504Z",
      "id":  "Movianto::GBSWMPRD:GBSWMPRD",
      "group":  "Movianto::GBSWMPRD",
      "name":  "GBSWMPRD",
      "platform":  "ibm",
      "updatedAt": "2015-09-23T09:24:42.613Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:43.181Z",
      "id":  "Societe Generale::BCC-SGU-TC-02:BCC-SGU-TC-02",
      "group":  "Societe Generale::BCC-SGU-TC-02",
      "name":  "BCC-SGU-TC-02",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.238Z"
    },
    {
    "createdAt":  "2015-09-23T09:24:42.071Z",
      "id":  "UMGI::UKBCEWVAPP077:UKBCEWVAPP077",
      "group":  "UMGI::UKBCEWVAPP077",
      "name":  "UKBCEWVAPP077",
      "platform":  "windows",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    },
    {
      "createdAt":  "2015-09-23T09:24:43.194Z",
      "id":  "Wilkinson::GBWILW04:GBWILW04",
      "group":  "Wilkinson::GBWILW04",
      "name":  "GBWILW04",
      "platform":  "question",
      "updatedAt": "2015-09-23T09:24:43.130Z"
    }
  ];

  return r.table("Device").insert(devices).run();

});
