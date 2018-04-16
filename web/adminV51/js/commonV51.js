$(document).ready(function(){
	loadLang($.cookie("lang"));
	$("#lang-us").click(function(){
		$.cookie("lang","us")
		loadLang($.cookie("lang"));
 	});
	
	$("#lang-kr").click(function(){
		$.cookie("lang","kr")
		loadLang($.cookie("lang"));
 	});
});

function loadLang(lang){
	if(typeof(lang)  === "undefined"){
		lang = "kr";
		obj = lang_kr;
		alert("11");
		alert($.cookie("lang"));
		$.cookie("lang","kr")
	}else if(lang == "kr"){
		obj = lang_kr
	}else if(lang == "us"){
		obj = lang_us
	}
	
	console.log(lang);
	for (var key in obj) {
	  $("." + key).html(obj[key]);
	}
}


var lang_kr = {
		"lbl_mem_mn": "회원 관리 지역",
	    "lbl_transaction": "거래",
	    "lbl_settlement": "정산",
	    "lbl_capture": "캡처",
	    "lbl_sttl_list": "화해 목록 검색 조건",
	    "lbl_mem_no": "회원번호",
	    "lbl_currencies": "통화",
	    "lbl_search": "검색",
	    "lbl_sttl_no": "정산 번호",
	    "lbl_sttl_st": "정산 상태",
	    "lbl_tot_trans_amt": "총 거래 금액",
	    "lbl_fee": "수수료",
	    "lbl_etc_fee": "기타 비용",
	    "lbl_currency": "통화",
	    "lbl_actions": "작업",
	    "lbl_sttl_trans_list": "정산거래 목록",
	    "lbl_trans_id": "거래 ID",
	    "lbl_trans_amt": "거래 금액",
	    "lbl_fee_rate": "수수료 비율",
	    "lbl_sttl_amt": "정산 금액",
	    "lbl_close": "닫기",
	    "lbl_trans_list": "거래 목록",
	    "lbl_trans_tp": "거래 유형",
	    "lbl_selt_trans_tp": "거래 유형 선택",
	    "lbl_trans_st": "거래 상태",
	    "lbl_buyer": "구매자",
	    "lbl_card_tp": "카드 종류",
	    "lbl_trans_dt": "거래 날짜",
	    "lbl_trans_amt": "거래 금액",
	    "lbl_tid": "TID / OrderNo",
	    "lbl_crd_apprvl_no": "카드 승인 번호",
	    "lbl_merchant_no": "상인 번호",
	    "lbl_card_prefix": "카드 앞번호",
	    "lbl_van_no": "밴번호",
	    "lbl_terminal_no": "터미널 번호",
	    "lbl_amt": "금액",
	    "lbl_result_msg": "결과 메시지",
	    "lbl_cancel": "취소",
	    "lbl_capture_req_search": "캡처 요청 검색",
	    "lbl_trans_no": "거래 번호",
	    "lbl_req_dt": "요청 날짜",
	    "key5": "VALUE5"
};

var lang_us = {
    "lbl_mem_mn": "Member Management Area",
    "lbl_transaction": "Transaction",
    "lbl_settlement": "Settlement",
    "lbl_capture": "Capture",
    "lbl_sttl_list": "Settlement List Search Condition",
    "lbl_mem_no": "MemNo",
    "lbl_currencies": "Currencies",
    "lbl_search": "Search",
    "lbl_sttl_no": "Settlement No",
    "lbl_sttl_st": "Settlement Status",
    "lbl_tot_trans_amt": "Total Transaction Amount",
    "lbl_fee": "Fee",
    "lbl_etc_fee": "Etc Fee",
    "lbl_currency": "Currency",
    "lbl_actions": "Actions",
    "lbl_sttl_trans_list": "Settlement Details Information List",
    "lbl_trans_id": "Transaction ID",
    "lbl_trans_amt": "Transaction Amount",
    "lbl_fee_rate": "Fee Rate",
    "lbl_sttl_amt": "Settlement Amount",
    "lbl_close": "Close",
    "lbl_trans_list": "Transaction Details Search Condition",
    "lbl_trans_tp": "Transaction Type",
    "lbl_selt_trans_tp": "Select Transaction Type",
    "lbl_trans_st": "Transaction Status",
    "lbl_buyer": "Buyer",
    "lbl_card_tp": "Card Type",
    "lbl_trans_dt": "Transaction Date",
    "lbl_trans_amt": "Transaction Amount",
    "lbl_tid": "TID / OrderNo",
    "lbl_crd_apprvl_no": "Card Apprvl No",
    "lbl_merchant_no": "Merchant No",
    "lbl_card_prefix": "Card Prefix",
    "lbl_van_no": "vanNo",
    "lbl_terminal_no": "Terminal No",
    "lbl_amt": "Amount",
    "lbl_result_msg": "Result Message",
    "lbl_cancel": "Cancel",
    "lbl_capture_req_search": "Capture Request Search",
    "lbl_trans_no": "Transaction No",
    "lbl_req_dt": "Request Date",
    "key5": "value5"
};