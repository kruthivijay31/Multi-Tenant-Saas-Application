	var myApp = angular.module('scrumApp',[]);
	myApp.controller('ScrumAppCtrl', function($scope, $http) {
	//	console.log("Hello from controller.js");
	

	var refresh = function() {
		
		//get user all user stories
		$http.get('/userStoryList').success(function (response) {
			$scope.userStoryList = response;		
		});

		//get all sprintIds
		$http.get('/sprintIdList').success(function (response) {
			$scope.sprintIdList = response;	
		});

		$scope.markCompletedSuccessMessage = "";

		//calc actualPts
		$http.get('/actualPoints').success(function(response) {
			//console.log(response);
			if(response[0]) {
				//handles the case where there are stories created.
				if (response[0].actualPoints)
					$scope.actualPoints = response[0].actualPoints;
				//handles the case where no stories created.
				else {
					$scope.actualPoints = "0"; 
					$scope.completionDate = "Cannot compute as there are no stories created!";
				}
				//handles the case where there are sprints created.
				if (response[0].expectedPoints)
					$scope.expectedPoints = response[0].expectedPoints;		
				//handles the case where there are no sprints created.
				else {
					$scope.expectedPoints = "0";
					$scope.completionDate = "Cannot compute as there are no sprints created!";
				}
				//handles the case where we have atleast one sprint created.
				if($scope.expectedPoints > 0) {
					//1 point = 1/3rd of the day; remainingDays = (diff in points)/3
					var remainingDays = Math.ceil((Math.abs(($scope.expectedPoints - $scope.actualPoints)/3) ));
					var myDate = new Date();
					myDate.setDate(myDate.getDate() + remainingDays);
					var dd = myDate.getDate();
					var mm = myDate.getMonth() + 1;
					var y = myDate.getFullYear();
					$scope.completionDate = dd + "/" + mm + "/" + y;
				}
			}
			//handles the case where there no stories and sprints created.
			else {
				$scope.expectedPoints = 0;
				$scope.actualPoints = 0;
				$scope.completionDate = "Cannot compute completion date. Looks like there are no  stories and sprints created!"
			}
		}); 
	};

	refresh();

	//hideSprintTable()
	$scope.hideSprintTable = function(){
		$scope.showMarkBtn ="";
		$scope.showTable = "";
		$scope.showWarning = "";
		$scope.markCompletedSuccessMessage ="";
	};
	
	
	var sprintStories = function(sprintId) {
		$http.get('/sprintStoryList/' + sprintId).success(function(response) {
				$scope.sprintStoryList = response;
				console.log(response);
				if(response[0])
				{
					$scope.showMarkBtn = "1";
				}
				else 
					$scope.showWarning = 1;
			});
	}

	 //get user stories for a sprintId
	$scope.getSprintStories = function (sprintId) { 
		$scope.markCompletedSuccessMessage = "";
		if(sprintId) {
			$scope.showTable = 1;
			// $http.get('/sprintStoryList/' + sprintId).success(function(response) {
			// 	$scope.sprintStoryList = response;
			// 	console.log(response);
			// 	if(response[0])
			// 	{
			// 		$scope.showMarkBtn = "1";
			// 	}
			// 	else 
			// 		$scope.showWarning = 1;
			// });
			sprintStories(sprintId);
		} 
	};

	//add story
	$scope.addStory = function() {
		$http.post('/userStoryList', $scope.story).success(function(response) {
			refresh();
			console.log("I got response");
			console.log(response);
		    $scope.story = "";
		});
	};

	//add sprint
	$scope.addSprint = function() {
		$http.post('/sprintIdList', $scope.sprint).success(function(response) {
			//sprintListRefresh();
			refresh();
			$scope.sprint = "";
		});
	};

	//edit story
	$scope.editStory = function(id) {
		$http.get('/userStoryList/' + id).success(function(response) {
			$scope.userStory = response;
		});
	};

	//update story
	$scope.updateStory = function() {
		var id = $scope.userStory._id;
		$http.put('/userStoryList/' + id, $scope.userStory).success(function(response) {
			$scope.userStory = response;
			refresh();
		});
	};

	//remove story
	$scope.removeStory = function(id) {
		$http.delete('/userStoryList/' + id).success(function(response) {				
			refresh();
		});
	};

	//mark sprint complete --> update all the userStories corresponding to this sprint to userStoryStatus = 2; also update the sprintStatus = 2
	//(sprintStatus = 2 means completed; 0 means not assigned; 1 means assigned but not complete)
	$scope.markSprintComplete = function(sprintId) {
		$scope.markCompletedSuccessMessage = "";
			$http.put('/' + sprintId).success(function(response) {
				$scope.markCompletedSuccessMessage = " Success! Selected sprint is marked as complete!";
				sprintStories(sprintId);
			});
	};

	var actualPts = function() {
		$http.get('/actualPoints').success(function(response) {
			$scope.actualPoints = response;		
		});
	};

});

 	
	