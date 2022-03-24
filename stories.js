"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */
//contains code for UI about listing stories.

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const star = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
      ${star ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function getStarHTML(story, user){
  const isFav = user.isFav(story);
  const starType = isFav ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
async function submitNewStory(e){
  console.debug("submitnewstory");
  e.preventDefault();
  const title = $("#title").val();
  const author = $("#author").val();
  const url = $("#url").val();
  const username = currentUser.username;
  const storyData = {title, url, author, username };
  const story = await storyList.addStory(currentUser, storyData);
  
  const $story = generateStoryMarkup(story)
 $allStoriesList.prepend($story);

 $submitForm.slideUp("slow");
 $submitForm.trigger("reset");
 putStoriesOnPage();

}
$submitForm.on("submit", submitNewStory);

function putFavoritesListOnPage(){
  console.debug("putfavlistonpage");

  $favoritedStories.empty();

  if(currentUser.favorites.length === 0){
    $favoritedStories.append("<h5>No favorites added!</h5>");
  } else{
    for(let story of currentUser.favorites){
      const $story = generateStoryMarkup(story);
    $favoritedStories.append($story);
    }
  }
    $favoritedStories.show();
  
}

async function toggleStoryFavorite(e){
  console.debug("togglestoryfav");
  const $tgt = $(e.target);
  const $closestli = $tgt.closest("li");
  const storyId = $closestli.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if($tgt.hasClass("fas")){
    await currentUser.removeFavorites(story);
    $tgt.closest("i").toggleClass("fas far");
  }else{
    await currentUser.addFavorites(story);
    $tgt.closest("i").toggleClass("fas far")
  }
}
$storiesLists.on("click", ".star", toggleStoryFavorite);
