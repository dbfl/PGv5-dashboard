 (function () {
    'use strict';

    angular
        .module('inspinia')
        .factory('MemberService', MemberService);
    

    MemberService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout','$q', '$filter','Utils', '$log'];
    function MemberService($http, $cookieStore, $rootScope, $timeout, $q, $filter, Utils, $log) {
        var service = {};
			service.getTotal = getTotal;
			service.getTotalByDate = getTotalByDate;
			service.getTotalPhoneStatus = getTotalPhoneStatus;
			service.getTotalEmailStatus = getTotalEmailStatus;
			service.getListMemberToday = getListMemberToday;
			service.getListMember = getListMember;
			service.getMemberDetail = getMemberDetail;
			service.getListCountry = getListCountry;
			service.getListBank = getListBank;
			service.getListBankBylang = getListBankBylang;
			service.getListVB = getListVB;
			service.createMember = createMember;
			service.editMemberName = editMemberName;		// 2016.12.01, by aajik, add, SFT-290
			service.assignLogin = assignLogin;
			service.assignVirtual = assignVirtual;
			service.assignBank = assignBank;
			service.getTotalMember = getTotalMember;
			service.editMemberPhoneNo = editMemberPhoneNo;	// 2016.12.01, by aajik, add, SFT-290
			service.editMemberemailAddrss = editMemberemailAddrss;	// 2016.12.01, by aajik, add, SFT-290
			service.getMemberAccntName = getMemberAccntName;	// 2016.12.05, by aajik, add, SFT-290
			service.getChangeStatus = getChangeStatus;
			service.getKeysOfBanks = getKeysOfBanks;
			service.resetVirtualAccount = resetVirtualAccount;
			service.getRecentTransaction = getRecentTransaction;
			service.getChangeOwnershipStatus = getChangeOwnershipStatus;
			service.requestResetPassword  = requestResetPassword;
			service.unassignVitualAccount  = unassignVitualAccount;
			service.getFollowedMerchants  = getFollowedMerchants;

			
			//member account block, release  list, search 
			service.setMemberWithdrawalBlock             = setMemberWithdrawalBlock;
			service.setMemberWithdrawalBlockRelease      = setMemberWithdrawalBlockRelease;
			service.setMemberWithdrawalBlockedList       = setMemberWithdrawalBlockedList;
			service.setMemberWithdrawalBlockedListSearch = setMemberWithdrawalBlockedListSearch;

			service.getAllListBankKr  = getAllListBankKr;
			service.getAllListBankEn  = getAllListBankEn;

			service.assignVirtual = assignVirtual;
			
			
			service.getTmpGuidAndTmpKeyp   = getTmpGuidAndTmpKeyp;
			
			//service.getSeyfertBalance = getSeyfertBalance;
        return service;
		
        
        function getListCountry(){
        	return Utils.requestAPI('v5a/code/detail/all?_method=GET&','grpKey=COUNTRY');
        }
		
		//API has been changed
		function getListBank(){
        	return Utils.requestAPI('v5/code/listOf/banks?_method=GET&','langCd=ko');
        }
		//TODO 요청해서 은행목록 조회하는 api 통합 
		function getListBankBylang(){
        	return Utils.requestAPI('v5/code/listOf/banks/en?_method=GET&','langCd=en');
        }
		function getAllListBankKr(){
        	return Utils.requestAPI('v5/code/listOf/BNK_CD?_method=GET&','');
        }
		function getAllListBankEn(){
        	return Utils.requestAPI('v5/code/listOf/BNK_CD/en?_method=GET&','');
        } 
		//added a new function and API
		function getListVB() {
			return Utils.requestAPI('v5/code/listOf/availableVABanks/p2p/charge?_method=GET&', '');
		}
		
		function getTotalMember(){
        	return Utils.requestAPI('v5a/member/count?_method=GET&', '');
        }
		
		
		function assignBank(paramStr){
        	return Utils.requestAPI('v5a/member/bnk?_method=POST&', paramStr);
        }
		
		function assignVirtual(paramStr){
        	return Utils.requestAPI('v5a/member/assignVirtualAccount/p2p?_method=PUT&', paramStr);
        }
		
		function assignLogin(paramStr){
        	return Utils.requestAPI('v5a/login/user?_method=POST&', paramStr);
        }
		
		function createMember(paramStr){
        	var params = paramStr + "&phoneTp=MOBILE&emailTp=PERSONAL";
			return Utils.requestAPI('v5a/member/createMember?_method=POST&', params);
        }
		
		// 2016.12.01, add aajik, 변경할 수 있도록 SFT-290-->
		function editMemberName(paramStr){
			return Utils.requestAPI('v5a/member/allInfo?_method=PUT&', paramStr);
        }
		
		// 2016.12.01, add aajik, 변경할 수 있도록 SFT-290-->
		function editMemberemailAddrss(paramStr){
			return Utils.requestAPI('v5a/member/allInfo?_method=PUT&', paramStr);
        }

		// 2016.12.01, add aajik, 변경할 수 있도록 SFT-290-->
		function editMemberPhoneNo(paramStr){
			return Utils.requestAPI('v5a/member/allInfo?_method=PUT&', paramStr);
        }
				
		// 2016.12.05, add aajik, 계좌번호로 계좌주 조회 SFT-290-->
		function getMemberAccntName(paramStr){
			return Utils.requestAPI('v5a/bank/inquirebnkname?_method=GET&', paramStr);
        }
		
		function getListMember(page, limit, paramStr){
        	var params = 'limit=' + limit + '&page='+ page + '&' + paramStr;
			return Utils.requestAPI('v5a/member/allInfo?_method=GET&', params);
        }
		
		function getMemberDetail(paramStr){
        	return Utils.requestAPI('v5a/member/privateInfo?_method=GET&', paramStr);
        }
		
		function getTotalByDate(paramStr){
        	return Utils.requestAPI('v5a/member/byDt?_method=GET&', paramStr);
        }
        
		function getTotal(){
        	return Utils.requestAPI('v5a/member/count?_method=GET&'  ,'');
        }
		
		function getListMemberToday(){
			return Utils.requestAPI('v5a/member/create/day?_method=GET&', '');
        }

		function getTotalPhoneStatus(){
			return Utils.requestAPI('v5a/member/phone/stCnt?_method=GET&','');
        }
		
		function getTotalEmailStatus(){
			return Utils.requestAPI('v5a/member/email/stCnt?_method=GET&', '');
        }
		
		function getChangeStatus(paramStr){
			return Utils.requestAPI('v5a/member/verify?_method=PUT&', paramStr);
		}
		
		function getKeysOfBanks(paramStr){
			return Utils.requestAPI('v5a/member/verify?_method=PUT&', paramStr);
		}
		
		function resetVirtualAccount(paramStr){
			return Utils.requestAPI('v5a/member/assignVirtualAccount/p2p?_method=PUT&', paramStr);
		}
		
		function getRecentTransaction(paramStr){
			return Utils.requestAPI('v5a/admin/seyfertList?_method=GET&', paramStr);
		}		
		
		
		function getChangeOwnershipStatus(paramStr){
			return Utils.requestAPI('v5a/member/verify?_method=PUT&', paramStr);
		}
		
		function requestResetPassword(paramStr){
			return Utils.requestAPI('v5a/login/reset?_method=POST&',paramStr);
		}
		
		function unassignVitualAccount(paramStr){
			return Utils.requestAPI('v5a/member/unassignVirtualAccount?_method=POST&', paramStr);
		}
		
		/**
		 * @method 멤버가 어느 업체로 부터 파생 되었으며 , 어느 업체를 팔로우 하고 있는지 *only for admin  
		 * @param dstMemGuid = 멤버 GUID
		 * */
		function getFollowedMerchants(paramStr){ //dstMemGuid
			return Utils.requestAPI('v5a/member/followedMerchants?_method=GET&', paramStr);
		}
		/**
		 * @method View As 를 위한 파라미터로 보내는 GUID 에 대한 임시 keyP 와 임시 guid.  
		 * 
		 * */
		function getTmpGuidAndTmpKeyp(paramStr){
			return Utils.requestAPI('v5a/login/merchant?_method=POST&',paramStr);
		}

//		function getChangeStatus(paramStr){
//			return Utils.requestAPI('http://www.mocky.io/v2/592faec91100005a0eb39225?_method=GET&', paramStr);
//		}
//		
//		function getKeysOfBanks(paramStr){
//			return Utils.requestAPI('http://www.mocky.io/v2/592faec91100005a0eb39225?_method=GET&', paramStr);
//		}
		
		/*function getSeyfertBalance(paramStr){
			return Utils.requestAPI('v5/member/seyfert/inquiry/balance?_method=GET&');
		}*/

		
		/**
		 * @method 멤버의 계좌 출금 차단
		 */
		function setMemberWithdrawalBlock(paramStr){
			return Utils.requestAPI('/v5a/admin/member/block?_method=POST&',paramStr);
		}

		/**
		 * @method 멤버의 계좌 출금 차단 해제
		 */
		function setMemberWithdrawalBlockRelease(paramStr){
			return Utils.requestAPI('/v5a/admin/member/block/release?_method=PUT&',paramStr);
		}

		/**
		 * @method 출금차단된 멤버 목록 조회
		 */
		function setMemberWithdrawalBlockedList(paramStr){
			return Utils.requestAPI('/v5a/admin/member/block?_method=GET&',paramStr);
		}
		
		/**
		 * @method 출금차단된 멤버 목록 검색
		 */
		function setMemberWithdrawalBlockedListSearch(paramStr){
			return Utils.requestAPI('/v5a/admin/member/block/search?_method=GET&',paramStr);
		}

		
    }

})();
