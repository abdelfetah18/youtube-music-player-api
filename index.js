const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const axios = require("axios").default;
const cheerio = require("cheerio");
const ytdl = require("ytdl-core");


app.get("/video/:video_id", async (req, res) => {
   var videoID = req.params.video_id;
   let info = await ytdl.getInfo(videoID);
    let audioFormats = info.formats.filter(f => f.container == "mp4");
    res.status(200).json({
        status: "success",
        data: { url: audioFormats[0].url, title: info.videoDetails.title, thumbnail: info.videoDetails.thumbnail.thumbnails[info.videoDetails.thumbnail.thumbnails.length - 1].url, }
    });
});

app.get("/category/:category", (req, res) => {
    const query = req.params.category;
    const body = {"context":{"client":{"hl":"en","gl":"DZ","remoteHost":"197.200.238.163","deviceMake":"","deviceModel":"","visitorData":"CgtMOVJCTTkwVDFwQSicgpidBg%3D%3D","userAgent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36,gzip(gfe)","clientName":"WEB","clientVersion":"2.20221220.09.00","osName":"Windows","osVersion":"6.1","originalUrl":"https://www.youtube.com/results?search_query="+query,"platform":"DESKTOP","clientFormFactor":"UNKNOWN_FORM_FACTOR","configInfo":{"appInstallData":"CJyCmJ0GEIjhrgUQvNquBRC4i64FELjUrgUQieiuBRDa6a4FELac_hIQzN-uBRDX5K4FELmQ_hIQsoj-EhCC3a4FELfgrgUQ4tSuBRDt8K4FEIfdrgUQouyuBRC5nP4SENCd_hIQ2L6tBRCR-PwS"},"timeZone":"Etc/GMT-1","browserName":"Chrome","browserVersion":"108.0.0.0","acceptHeader":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9","deviceExperimentId":"ChxOekU0TURReU56ZzNOall4T0RjME1UWTRNdz09EJyCmJ0GGJyCmJ0G","screenWidthPoints":482,"screenHeightPoints":757,"screenPixelDensity":1,"screenDensityFloat":1,"utcOffsetMinutes":60,"userInterfaceTheme":"USER_INTERFACE_THEME_LIGHT","memoryTotalKbytes":"4000000","mainAppWebInfo":{"graftUrl":"/results?search_query="+query,"pwaInstallabilityStatus":"PWA_INSTALLABILITY_STATUS_UNKNOWN","webDisplayMode":"WEB_DISPLAY_MODE_BROWSER","isWebNativeShareAvailable":false}},"user":{"lockedSafetyMode":false},"request":{"useSsl":true,"internalExperimentFlags":[],"consistencyTokenJars":[]},"clickTracking":{"clickTrackingParams":"CA0Q7VAiEwjy88ezvJD8AhULrRYKHd2UDTQ="},"adSignalsInfo":{"params":[{"key":"dt","value":"1671823644993"},{"key":"flash","value":"0"},{"key":"frm","value":"0"},{"key":"u_tz","value":"60"},{"key":"u_his","value":"2"},{"key":"u_h","value":"900"},{"key":"u_w","value":"1600"},{"key":"u_ah","value":"860"},{"key":"u_aw","value":"1600"},{"key":"u_cd","value":"24"},{"key":"bc","value":"31"},{"key":"bih","value":"757"},{"key":"biw","value":"466"},{"key":"brdim","value":"0,0,0,0,1600,0,1600,860,482,757"},{"key":"vis","value":"1"},{"key":"wgl","value":"true"},{"key":"ca_type","value":"image"}],"bid":"ANyPxKpq7QQmM262wsLDv2GhbqVhIYQxx6qHTnoiD7xbJ14wf7dJ1U-ZoKIujsmY3qy8JIezuwewTcpcLOU65pFLcyI6YVP_3w"}},"query":query,"webSearchboxStatsUrl":"/search?oq="+query+"&gs_l=youtube.3..0i512i433i131k1j0i512i433k1j0i512i433i131k1l2j0i512i433k1j0i433i131k1j0i512k1l2j0i512i433i131k1l2j0i512k1j0i512i433i131k1j0i433i131k1j0i512i433i131k1.1164.1784.0.2547.5.5.0.0.0.0.321.321.3-1.1.0.qsatc3,ytpo-bo-me=0,ytposo-bo-me=0,ytpo-bo-ei=45387042,ytposo-bo-ei=45387042,cfro=1,ytpo-bo-me=1,ytposo-bo-me=1,ytpo-bo-ei=45387043,ytposo-bo-ei=45387043...0...1ac.1.64.youtube..4.1.321....0.Q2xhzWHYVWg"};
    axios.post("https://www.youtube.com/youtubei/v1/search?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8&prettyPrint=false", body).then( response => {
        let data = response.data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
        data = data.filter((v) => v.videoRenderer);
        data = data.map(v => ({ thumbnail: v.videoRenderer.thumbnail.thumbnails[v.videoRenderer.thumbnail.thumbnails.length - 1].url , videoId: v.videoRenderer.videoId, title: v.videoRenderer.title.runs[0].text }));
        res.status(200).json({
            status: "success",
            count: response.data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents.length,
            data
        });
        
    }).catch( err => {
        res.status(500).json({
            status: "error",
            error: err
        })
    });
});

app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "HelloWorld!"
    });
});

app.listen(PORT, () => {
    console.log("server is up running on port:", PORT);
})