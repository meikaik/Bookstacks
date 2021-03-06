// controller
Bookstacks.controller('mainCtrl',
  ['$scope', 'LoginFactory', 'PostStorage', 'ServerPostsFactory', '$window',
  function($scope, LoginFactory, PostStorage, ServerPostsFactory, $window){

    // facebook groupid
  $scope.groupid = 2265647819;

  // Initial variables
  $scope.signedIn = false;

  // Facebook Login
  $scope.login = function(){
    LoginFactory.login()
      .then(function(data){
        if(data){
          //console.log(data);
          $scope.signedIn = true;
          $scope.accessToken = data.accessToken;
          $scope.profile = data.profile;

          // Get posts from facebook
          $scope.get_recent_posts();

          // And get db posts
          $scope.get_db_posts($scope.groupid);

            $(document).ready(function() {
                $("#RHS").niceScroll({
                      cursorwidth:"20px",
                      zindex: 99
                    });
            });
        }
      }, function(err){
        console.log(err);
      });
  };

  // Get posts from Facebook
  $scope.get_recent_posts = function(){
    FB.api(
        "/"+$scope.groupid+"/feed?limit=20",
        function (response) {
          if (response.data && !response.error) {
            //$scope.posts = response.data;
            //$scope.$apply(function () {});

            $scope.flush_olds_and_send_news(response.data, $scope.groupid);
          }else{
            console.log(response.error);
          }
        }
      );
  }

  // Get rid of old posts and submit new ones to server
  $scope.flush_olds_and_send_news = function(feed, groupid){
    ServerPostsFactory.processPosts(feed, groupid, $scope.profile, $scope.accessToken);
  };

  // get posts from database
  $scope.get_db_posts = function(groupid){
    // build the object to store user info
    var user_profile = {
      profile: $scope.profile,
      accessToken: $scope.accessToken,
      groupid: groupid
    };

    // get the posts from server via a service
    ServerPostsFactory.get_server_posts(user_profile)
      .then(function(data){
        console.log(data.data);
        $scope.posts = data.data;       // show those posts retrieved from server
      }, function(err){
        console.log(err);
      });
  };

  $scope.openUrl = function(post){
    var win = window.open(post.posturl, '_blank');
    win.focus();
  }
}])
.filter('schoolFilter', function(){
  return function(schedule){

  var array = ['AFM 131', 'ARBUS 101', 'CHEM 120', 'ECON 102'];
  var courses = []
  for (i=0; i < array.length; i++){
    if (String(schedule).indexOf(array[i]) >= 1){
      courses[i] = array[i];
    }
    else{

    }
  }
  return courses
}});

