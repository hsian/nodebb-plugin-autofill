<form role="form" class="quickstart-settings form-horizontal">
	<div class="row">
		<div class="form-group clearfix">
			<label  class="col-sm-2 control-label">url</label>
			 <div class="col-sm-10">
			      <input type="text" class="form-control" id="url" placeholder="url">
			 </div>
		 </div>
		 <div class="form-group clearfix">
			<label  class="col-sm-2 control-label">title</label>
			 <div class="col-sm-10">
			      <input type="text" class="form-control" id="c_title" placeholder="title className/id/node">
			 </div>
		 </div>
		 <div class="form-group clearfix">
			<label  class="col-sm-2 control-label">content</label>
			 <div class="col-sm-10">
			      <input type="text" class="form-control" id="c_content" placeholder="content className/id/node">
			 </div>
		 </div>
		 <div class="form-group">
		    	<div class="col-sm-offset-2 col-sm-10">
			      <div class="checkbox">
			        <label>
			          <input type="checkbox" id="gizp"> gizp
			        </label>
			      </div>
			 </div>
		 </div>
		 <div class="form-group clearfix">
		    <div class="col-sm-offset-2 col-sm-10">
		      <button id="save" class="btn btn-primary">save</button>
		    </div>
		  </div>
	</div>
</form>

<script type="text/javascript">


	$(document).ready(function() {
		$('#save').on('click', function() {

			$.post(config.relative_path + '/api/admin/plugins/autofill/post', {
				
				url : $("#url").val(),
				title : $("#c_title").val(),
				content : $("#c_content").val(),
				gzip : $("#gzip").is(":checked")

			}, function(data) {
				app.alertSuccess('post success');
			});

			return false;
		});
	});
</script>
