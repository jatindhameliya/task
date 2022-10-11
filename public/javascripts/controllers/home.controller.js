app.controller("HomeController", ($scope, $http, HelperService) => {
	$scope.totalActivePost = 0;
	$scope.totalInactivePost = 0;
	$scope.getpostCount = () => {
		$http({
			url: "/posts/count",
			method: "POST",
			data: {},
			cache: false,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.totalActivePost = response.data.Data.activepost;
					$scope.totalInactivePost = response.data.Data.inactivepost;
				}
			}, function (error) {
				console.error(error);
			}
		);
	};
	$scope.getpostCount();
	$scope.page = 1;
	$scope.postList = [];
	$scope.search = '';
	$scope.limit = "10";
	$scope.pageNumberList = [];
	$scope.getPosts = () => {
		let jsonData = { page: $scope.page, limit: $scope.limit, search: $scope.search };
		$http({
			url: "/posts/list",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.postList = response.data.Data;
					let data = HelperService.paginator($scope.postList.totalPages, $scope.page, 9);
					$scope.pageNumberList = data;
				}
			}, function (error) {
				console.error(error);
			}
		);
	};
	$scope.getPosts();
	$scope.onLimitChange = () => { $scope.page = 1; $scope.getPosts();};
	$scope.switchPage = (page) => {
		$scope.page = page;
	};
	$scope.$watch("page", () => $scope.getPosts());
	$scope.postId = 0;
	$scope.title= '';
	$scope.body= '';
	$scope.status = 'Active';
	$scope.latitude = 0;
	$scope.longitude = 0;
	$scope.addNewPost = () => {
		$scope.title = '';
		$scope.body = '';
		$scope.status = 'Active';
		$scope.latitude = 0;
		$scope.longitude = 0;
		$('#newPostModel').modal('show');
	};
	$scope.onEdit = (post) => {
		$scope.postId = post._id;
		$scope.title = post.title;
		$scope.body = post.body;
		$scope.status = (post.status) ? 'Active' : 'In-Active';
		$scope.latitude = post.location.coordinates[1];
		$scope.longitude = post.location.coordinates[0];
		$('#newPostModel').modal('show');
	};

	$scope.onPostSave = () => {
		$http({
			url: "/posts/save",
			method: "POST",
			cache: false,
			data: { postId: $scope.postId, title: $scope.title, body: $scope.body, status: $scope.status, latitude: $scope.latitude, longitude:$scope.longitude },
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$('#newPostModel').modal('hide');
					$scope.getPosts();
					$scope.getpostCount();
				}
			}, function (error) {
				console.error(error);
			}
		);
	};
	$scope.onDelete = (postid) => {
		$http({
			url: "/posts/delete",
			method: "POST",
			cache: false,
			data: { postId: postid },
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.getPosts();
					$scope.getpostCount();
				}
			}, function (error) {
				console.error(error);
			}
		);
	}

});
