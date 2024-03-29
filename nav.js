"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 * contains code to show/hide things in the navigation bar, 
 * and well as code for when a user clicks in that bar.

 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navSubmit.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function submit(evt){
  hidePageComponents();
$submitForm.show();
}
$navSubmit.on("click", submit);
