/* Main Settings JS file */
const settings = {
    local: {
        config: {
            /* host: 'desktop-esvk1ts',
            prefix: "/",
            port: 443,
            isSecure: true,
            */
            host: "1jkd6vi85zxoeh4.eu.qlikcloud.com",
            prefix:"/",
            port: 443,
            isSecure: true,
            webIntegrationId:"p39g8z6OSm3dBDntVhfx8_Kr5-VsEXKQ"
        },
        app_id: "3c62b3d0-5a7f-43b8-b99e-ad4ee3fbf420",
        scriptsUrl:"http://localhost/autoitalia-dashboard/",
        objects: {
            top_filters: [
                "QETpfj", //PC
                "gEEqtYe",//Domestic
                "mTbNvw"  //Dealer
            ],
            datetime:"nCNhwqx"
        },
        container:{
            invoices:{
                pclcv:"90cfb345-0e36-4e43-b52f-e69d172abd8b",
                brand:"f52ed079-4883-4340-9a25-65a4431da524",
                market:"d5cddc45-c360-4503-8bfa-574255d31810",
                motorizare:"5d5a2cc0-a5b7-403c-89c8-d6c77ecf9553"
            },
            contracts:{
                pclcv:"4824bcc9-3909-47b1-bfff-ae0a5aeab87b",
                brand:"e288b4e1-6c80-45cc-98c7-500d4f4c3911",
                market:"4652fe82-9a00-4022-97c8-c5dbdc8f366c",
                motorizare:"18a75d41-5975-4910-b575-cb51215817ee"
            }
        },
        variable:"vTargret"
    },
    prod: {
        config: {
            host: "1jkd6vi85zxoeh4.eu.qlikcloud.com",
            prefix:"/",
            port: 443,
            isSecure: true,
            webIntegrationId:"p39g8z6OSm3dBDntVhfx8_Kr5-VsEXKQ"
        },
        app_id: "5adc8bda-46a3-4c11-a1a0-6f56ad8364d8",
        //scriptsUrl:"https://ait-qlikgw.ait.autoitalia.ro/",
        scriptsUrl:"https://qlik.autoitalia.ro/",
        scriptsUrlTest:"https://qlikwebisr.github.io/ybcrcemj/",
        objects: {
            top_filters: [
                "QETpfj", //PC
                "gEEqtYe",//Domestic
                "mTbNvw"  //Dealer
            ],
            datetime:"nCNhwqx"
        },
        container:{
            invoices:{
                pclcv:"90cfb345-0e36-4e43-b52f-e69d172abd8b",
                brand:"f52ed079-4883-4340-9a25-65a4431da524",
                market:"d5cddc45-c360-4503-8bfa-574255d31810",
                motorizare:"5d5a2cc0-a5b7-403c-89c8-d6c77ecf9553"
            },
            contracts:{
                pclcv:"4824bcc9-3909-47b1-bfff-ae0a5aeab87b",
                brand:"e288b4e1-6c80-45cc-98c7-500d4f4c3911",
                market:"4652fe82-9a00-4022-97c8-c5dbdc8f366c",
                motorizare:"18a75d41-5975-4910-b575-cb51215817ee"
            }
        },
        variable:"vTargret"
    },
    measures: [
        {
			"qLabel": "Invoices(Daily)",
			"qLibraryId": "KyMbj"
		},
		{
			"qLabel": "Invoices (Monthly)",
			"qLibraryId": "FgENMp"
		},
		{
			"qLabel": "Invoices (Yearly)",
			"qLibraryId": "dpMSgJB"
		},
		{
			"qLabel": "% (Daily Invoices)",
			"qLibraryId": "gUWw"
		},
		{
			"qLabel": "% (Monthly Invoices)",
			"qLibraryId": "YCwPZ"
		},
		{
			"qLabel": "% (Yearly Invoices)",
			"qLibraryId": "FJJUpvR"
		},
        {
			"qLabel": "Contracts (Daily)",
			"qLibraryId": "zQdEtkC"
		},
		{
			"qLabel": "Contracts (Monthly)",
			"qLibraryId": "LbtEzN"
		},
		{
			"qLabel": "Contracts (Yearly)",
			"qLibraryId": "xsMZKj"
		},
        {
			"qLabel": "% CONTRACTS",
			"qLibraryId": "Whftn"
		}
    ]
}