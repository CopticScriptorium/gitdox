myPopup = '';

function openPopup(url) {
    myPopup = window.open(url,'popupWindow','width=640,height=480');
    if (!myPopup.opener)
         myPopup.opener = self;
}

function validate_doc() {
	$("#validate_editor").addClass("disabledbutton");
	$("#validation_report").html("Validating...");
	var docId = $("#id").val();
	var mode = $("#mode").val();
	var schema = $("#schema").val();
    $.ajax({
		url: 'validate.py',
    	type: 'post',
    	data: {doc_id: docId, mode: mode, schema: schema},
    	dataType: "html",
    	success: function(response) {
      	 	$("#validation_report").html(response);
       	 	$("#validate_editor").removeClass("disabledbutton");
       	},
       	error: function( jqXHR, textStatus, errorThrown) {
       	 	alert(errorThrown);
       	 	$("#validation_report").html("");
       	 	$("#validate_editor").removeClass("disabledbutton");
       	}
    });
}

function do_save(){
    if (document.getElementById('code')!=null){
        val = document.getElementById('code').value.replace(/&(?!amp;)/g,'&amp;');
        editor.getDoc().setValue(val);
        document.getElementById('code').value = val;
    }
    document.getElementById('editor_form').submit();
}

function export_ether(){
    doc_id = document.getElementById('doc_id').value;
    stylesheet = document.getElementById('ether_stylesheet').value;

    window.open('export.py?docs=' + doc_id + '&stylesheet=' + stylesheet, '_new');
}

$(document).ready(function () {
    // get id from hidden form element. Watch out, might break in the future
    var docid = $("#id").val();
    $('#metadata-table-container').jtable({
        title: 'Metadata',
        sorting: true,
        actions: {
            listAction: function (postData, jtParams) {
                jtParams.domain = 'meta';
                return $.Deferred(function ($dfd) {
                    $.ajax({
                        url: 'modules/editor_metadata.py?action=list&docid=' + docid,
                        type: 'POST',
                        dataType: 'json',
                        data: jtParams,
                        success: function (data) {
                            $dfd.resolve(data);
                        },
                        error: function() {
                            $dfd.reject();
                        }
                    });
                });
            },
            createAction: 'modules/editor_metadata.py?action=create',
            deleteAction: 'modules/editor_metadata.py?action=delete&docid=' + docid
        },
        fields: {
            id: {
                title: 'ID',
                key: true,
                visibility:'hidden'
            },
            docid: {
                title: 'Document ID',
                defaultValue: docid,
                type: 'hidden'
            },
            key: {
                title: 'Key',
                options: 'modules/editor_metadata.py?action=keys'
            },
            value: {
                title: 'Value'
            }
        }
    });
    $('#metadata-table-container').jtable('load');
});

