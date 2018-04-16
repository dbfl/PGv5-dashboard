/**
 * @author athan
 */

var loadingPannel;
loadingPannel = loadingPannel || (function () {
        var lpDialog = $("" +
            "<div class='modal hide' id='lpDialog' data-backdrop='static' data-keyboard='false'>" +
                "<div class='modal-dialog' style='padding-top:10%;'>" +
                    "<div class='modal-content'>" +
                        "<div class='modal-header'><b>Processing...</b></div>" +
                        "<div class='modal-body'>" +
                            "<div class='progress'>" +
                                "<div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuenow='100' aria-valuemin='100' aria-valuemax='100' style='width:100%'> "+
                                  "Please Wait..."+
                                "</div>"+
                              "</div>"+
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>");
        return {
            show: function () {
                lpDialog.modal();
            },
            hide: function () {
                lpDialog.modal('hide');
            },

        };
    })();
/*
$('#load').click(function() {
  loadingPannel.show();
});
*/