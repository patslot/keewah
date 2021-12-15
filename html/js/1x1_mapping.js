  var queries = {};
  var adid=""; 
  $.each(document.location.search.substr(1).split('&'),function(c,q){
    var i = q.split('=');
    if(i!=""){
        queries[i[0].toString()] = i[1].toString();
        if (queries.u){
            adid = queries.u;
        }
    }
  });
  
function campaign1x1_pv(q,c){
    
     c = typeof c !== 'undefined' ? c : 'INDEX';
     
    if (/android/i.test(navigator.userAgent)) platform = 'ANDROID';
	else if (/(iphone|ipod)/i.test(navigator.userAgent)) platform = 'IPHONE';
	else if (/iPad/i.test(navigator.userAgent)) platform = 'IPAD';
    else platform = 'WEB';
    
    var ngs_id = nxmTrack.readCookie('ngs_id');
   	if (ngs_id == null) ngs_id = '';
  	 nxmTrack.nxmAddSeg('NGSID=' + ngs_id);
    
    console.log(q);
    var resulturl ;
    var referrer =  document.referrer;
    
    nxmTrack.nxmAddSeg("REGION=HK");
    nxmTrack.nxmAddSeg("PROD=VONTOBEL");
    nxmTrack.nxmAddSeg("SITE=campaign.nextdigital.com.hk");
    nxmTrack.nxmAddSeg("PLATFORM="+platform);
    nxmTrack.nxmAddSeg("SECTION=CALCULATOR");
    nxmTrack.nxmAddSeg("CAT=FINANCE");
    nxmTrack.nxmAddSeg("CH=PARENTING");
    nxmTrack.nxmAddSeg("TITLE=vontobel");
    nxmTrack.nxmAddSeg("CID="+window.location.pathname.replace(/^.*[\\\/]/, ''));
    nxmTrack.nxmAddSeg("NEWS=ADSALES");
    nxmTrack.nxmAddSeg("CONTENT="+c);
    nxmTrack.nxmAddSeg("MEDIA=TEXT");
    nxmTrack.nxmAddSeg("EDM=");
    nxmTrack.nxmAddSeg("ACTION=PAGEVIEW");
    nxmTrack.nxmAddSeg("SUBSECT="+q);
    nxmTrack.nxmAddSeg("SUBSUBSECT=");
    nxmTrack.nxmAddSeg("MENU=");
    nxmTrack.nxmAddSeg("ISSUEID=20171018");
    nxmTrack.nxmAddSeg("AUTH=");
    nxmTrack.nxmAddSeg("GIGYAID=");
    nxmTrack.nxmAddSeg("ADID="+adid);
    nxmTrack.nxmAddSeg("NGSID="+ngs_id);
    nxmTrack.nxmAddSeg("SRC=AD");
    nxmTrack.nxmAddSeg("KY=投資");
    nxmTrack.nxmAddSeg("L=TC");
    nxmTrack.nxmAddSeg("REF="+referrer);
    nxmTrack.nxmSendPageDepth(0, new Date().getTime()); 
  //return resulturl;
}   

