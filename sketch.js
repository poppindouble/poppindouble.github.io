var particleSystem = [];
var hiddenParticles = [];
var outsiderParticles = [];
var strayParticles = [];
var imageHolderArray = [];

var forFunParticleSystem = [];
var forFunIndex;

var myCanvas;

var maxNearbyParticles = 0;
var minNearbyParticles = 0;

var myImage;
//var fontRegular;
//var facebookIcon;
//var twitterIcon;
//var instagramIcon;

var shouldAddParticles = false;
var positionYOffset = 100;


function preload() {
  myImage = loadImage("./double.png");
  //fontRegular = loadFont("font/PT_Sans-Web-Regular.ttf");
  //facebookIcon = loadImage("fb-black.svg");
  //twitterIcon = loadImage("Twitter-black.svg");
  //instagramIcon = loadImage("Insta-black.svg");

}

function openPopUp() {

  for(var i = 0; i < hiddenParticles.length; i++) {
    var p = hiddenParticles[i];
    var dx = p.targetX - mouseX;
    var dy = p.targetY - mouseY;
    var d = sqrt(dx * dx + dy * dy);
    if(d < 50) {
      var isPostEnglish = false;
      var isPostFrench = false;
      if (p.socialPost) {
        if (p.socialPost.tags.length == 2) {
          isPostEnglish = true
          isPostFrench = true
        } else {
          var postTags = p.socialPost.tags
          isPostEnglish = postTags[0]['value'] == 'has';
          isPostFrench = postTags[0]['value'] == 'hasa';
        }
      }
      if(window.isCurrentLanguageEnglish && isPostEnglish) {
          $(function () {
            navigateCarouselToIndex(hiddenParticles[i].socialPost.englishIndex);
          });
          break;
      } else if(!window.isCurrentLanguageEnglish && isPostFrench) {
          $(function () {
            navigateCarouselToIndex(hiddenParticles[i].socialPost.frenchIndex);
          });
          break;
      }
    }
  }

}

function setup() {
  randomSeed(0);
  var aspectRatio = myImage.width / myImage.height;
  var leafHeight = windowHeight * 0.8;
  var leafWidth = leafHeight * aspectRatio;

  var widthPadding = (windowWidth - leafWidth) / 2;
  var heightPadding = (windowHeight - leafHeight) / 2;

  var leafStartX = widthPadding;
  var leafStartY = heightPadding;
  var leafEndX = leafStartX + leafWidth;
  var leafEndY = leafStartY + leafHeight;

  myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent('sketch-container');
  myImage.loadPixels();


  myCanvas.mouseClicked(openPopUp)

  if(windowWidth <= 1400) {
    positionYOffset = 80
  }

  // PARTICLES - fundamental leaf

  for (var i = leafStartX; i < leafEndX; i += random(13, 16)) {
    for (var j = leafStartY; j < leafEndY; j += random(13, 16)) {
      var iX = floor(map(i, leafStartX, leafEndX, 0, myImage.width));
      var iY = floor(map(j, leafStartY, leafEndY, 0, myImage.height));
      var r = myImage.pixels[(iX + iY * myImage.width) * 4];
      // var g = myImage.pixels[(iX + iY) * myImage.width * 4 + 1];
      // var b = myImage.pixels[(iX + iY) * myImage.width * 4 + 2];
      if (r != 0) {
        var deltaX = random(-5, 5);
        var deltaY = random(-3, 3);
        particleSystem.push(particleMaker(i + deltaX, j + deltaY - positionYOffset));
      }
    }
  }

  particleSystem = shuffleArray(particleSystem);
  forFunIndex = particleSystem.length - 1;

  for (var i = 0; i < particleSystem.length; i++) {
    for (var j = i + 1; j < particleSystem.length; j++) {
      var distanceX = particleSystem[j].x - particleSystem[i].x;
      var distanceY = particleSystem[j].y - particleSystem[i].y;
      var distance = sqrt(distanceX * distanceX + distanceY * distanceY);
      if (distance < 50) {
        particleSystem[i].nearbyParticleNum += 1;
        particleSystem[j].nearbyParticleNum += 1;
      }
    }
  }

  maxNearbyParticles = -1;
  minNearbyParticles = particleSystem.length;
  for (var i = 0; i < particleSystem.length; i++) {
    if (maxNearbyParticles < particleSystem[i].nearbyParticleNum) {
      maxNearbyParticles = particleSystem[i].nearbyParticleNum;
    }
    if (minNearbyParticles > particleSystem[i].nearbyParticleNum) {
      minNearbyParticles = particleSystem[i].nearbyParticleNum;
    }
  }

  // PARTICLES - Stray

  var totalStrayNum = 40;
  while(strayParticles.length < totalStrayNum) {
    var x = random(0, windowWidth - 10);
    var y = random(0, windowHeight - 50);
    if (x < 300 && y < 300) {
      continue;
    }
    strayParticles.push(particleMaker(x, y - positionYOffset));
  }


  // PARTICLES - Hidden dots inside the leaf

  for (var i = 0; i < 350; i++) {
    var golden_angle = PI * (sqrt(2));
    var theta = i * golden_angle;
    var radias = (sqrt(i) / sqrt(100)) * 380;
    var hiddenX = radias * cos(theta) + width / 2;
    var hiddenY = radias * sin(theta) + height / 2;
    if (hiddenX < leafStartX || hiddenX > leafEndX || hiddenY < leafStartY || hiddenY > leafEndY) {
      continue;
    }
    var iX = floor(map(hiddenX, leafStartX, leafEndX, 0, myImage.width));
    var iY = floor(map(hiddenY, leafStartY, leafEndY, 0, myImage.height));
    var r = myImage.pixels[(iX + iY * myImage.width) * 4];
    if (r != 0) {
      hiddenParticles.push(particleMaker(hiddenX , hiddenY - positionYOffset));
    }
  }

  // PARTICLES - Outsiders - 6 outsider dots where previews will show up
  var offSet = 0
  if(windowWidth < 1920 && windowWidth > 1400) {
    offSet = 100
  } else if(windowWidth <= 1400 && windowWidth > 1168) {
    offSet = 150
  } else if(windowWidth <= 1168) {
    offSet = 180
  }

  //west side
  var outsiderPartical1X = floor((width / 2 - height / 2) / 2) + 200 + offSet;
  var outsiderPartical1Y = floor((height * 3 / 4) / 3);
  outsiderParticles.push(particleMaker(outsiderPartical1X, outsiderPartical1Y - positionYOffset));

  var outsiderPartical2X = floor((width / 2 - height / 2) / 2) + 200 + offSet;
  var outsiderPartical2Y = floor((height * 3 / 4) * 2 / 3);
  outsiderParticles.push(particleMaker(outsiderPartical2X, outsiderPartical2Y - positionYOffset));

  var outsiderPartical3X = floor((width / 2 - height / 2) / 2) + 200 + offSet;
  var outsiderPartical3Y = floor((height * 3 / 4));
  outsiderParticles.push(particleMaker(outsiderPartical3X, outsiderPartical3Y - positionYOffset));

  //east side
  var outsiderPartical4X = floor((width * 3 / 4 + height / 4)) - 200 - offSet;
  var outsiderPartical4Y = floor((height * 3 / 4) / 3);
  outsiderParticles.push(particleMaker(outsiderPartical4X, outsiderPartical4Y - positionYOffset));

  var outsiderPartical5X = floor((width * 3 / 4 + height / 4)) - 200 - offSet;
  var outsiderPartical5Y = floor((height * 3 / 4) * 2 / 3);
  outsiderParticles.push(particleMaker(outsiderPartical5X, outsiderPartical5Y - positionYOffset));

  var outsiderPartical6X = floor((width * 3 / 4 + height / 4)) - 200 - offSet;
  var outsiderPartical6Y = floor((height * 3 / 4));
  outsiderParticles.push(particleMaker(outsiderPartical6X, outsiderPartical6Y - positionYOffset));

  window.hiddenParticles = hiddenParticles;


  // $(function() {
  //   startFetchSocialContent();
  // });

  centerCanvas();



}


function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  myCanvas.position(x, y);
}

// function windowResized() {

//   centerCanvas();
// }


function particleMaker(x, y) {
  return {
    x : x,
    y : y,
    vx : 0,
    vy : 0,
    targetX : x,
    targetY : y,
    nearbyParticleNum : 0,
    socialPost : null,
    isImageLoaded : false
  };
}

function particleGoingBack(p) {
  var dx = p.x - p.targetX;
  var dy = p.y - p.targetY;
  var d = max(1, sqrt(dx * dx + dy * dy));

  var force = -d * 0.1;
  // For explosion effect
  // var force = -0.8 / d * d;

  var fX = dx/d * force;
  var fY = dy/d * force;
  p.vx = p.vx + fX;
  p.vy = p.vy + fY;
}

function updateParticle(p) {
  var dx = p.targetX - mouseX;
  var dy = p.targetY - mouseY;
  var d = max(1, sqrt(dx * dx + dy * dy));

  // For enhanced animation effects
  // var k = 1000
  // var force = map(sin(millis()/300), -1, 1, 0, 1) * k * 1/d;
  // var force = k / d;

  // var sigma = 100;
  // var mu = 50;
  //var force = min(0.5, 1 / (sigma * sqrt(2 * PI)) * exp(-(d - mu)^2/(2 * sigma^2)))

  // var k = 60;

  var k = random(30, 90);

  var force = min(15, k / d);

  // Update velocity with respect to mouse force
  if (d < 100 && d > 4) {
    //force = min(0.5, 1 / (sigma * sqrt(2 * PI)) * exp(-(d - mu)^2/(2 * sigma^2)))
    var fX = dx/d * force;
    var fY = dy/d * force;

    p.vx = p.vx + fX;
    p.vy = p.vy + fY;
  }

  // Update velocity with respect to original(target) position
  particleGoingBack(p);

  // Update velocity so that particles animate even when at rest
  var rx = random(-0.2, 0.2);
  var ry = random(-0.2, 0.2);
  p.vx = p.vx + rx;
  p.vy = p.vy + ry;

  // Update x and y position of particle
  p.x = p.x + p.vx;
  p.y = p.y + p.vy;

  // Add air resistance to prevent speed/force from continuously increasing in upcoming frames
  var airResistance = 0.8;
  p.vx = p.vx * airResistance;
  p.vy = p.vy * airResistance;

}

function renderParticle(p, stray, variance, size) {
  // Two options here, leave at edge more darker, the other is more random
  if (!stray && p.nearbyParticleNum < 20 && p.nearbyParticleNum !== -1) {
    var redColour = map(p.nearbyParticleNum, minNearbyParticles, maxNearbyParticles, 120, 230) + random(-50, 30);
    fill(redColour, 0, 0);
  }
  else {
    var randomNum = Math.floor(random(0, 6))
    if (randomNum === 0) {
      fill(126, 6, 1);
    } else if(randomNum === 1) {
      fill(153, 10, 0);
    } else if(randomNum === 2) {
      fill(175, 16, 19);
    } else if(randomNum === 3) {
      fill(191, 26, 30);
    } else if(randomNum === 4) {
      fill(211, 29, 36);
    } else {
      fill(226, 29, 38);
    }

  }

  var triSize = 10;
  var angle = random(2*PI);

  var randomX = random(1 - variance, 1 + size);
  var randomY = random(1 - variance, 1 + size);

  if (!stray && p.nearbyParticleNum < 13) {
    randomX = 0.95;
    randomY = 0.95;
  }

  translate(p.x, p.y);
  scale(randomX, randomY);
  rotate(angle);

  triangle(1 * triSize, 0 * triSize, -1/2 * triSize, sqrt(3)/2 * triSize, -1/2 * triSize, -sqrt(3)/2 * triSize);

  // star pattern particals;
  /*
  let r1 = 3;
  let r2 = 7;
  let scale_ratio = 2;
  star(0, 0, r1 * scale_ratio, r2 * scale_ratio, 5);
  */

  rotate(-angle);
  scale(1 / randomX, 1 / randomY);
  translate(-p.x, -p.y);
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function isWestSide(p) {
  if(p.x > width / 2) {
    return false;
  } else {
    return true;
  }
}

function showHiddenParticle(i) {
  noStroke()
  randomSeed(hiddenParticles[i].x)

  // var randomNum = Math.floor(random(0, 6))
  // console.log(randomNum)
  // if (randomNum === 0) {
  //   fill(126, 6, 1);
  // } else if(randomNum === 1) {
  //   fill(153, 10, 0);
  // } else if(randomNum === 2) {
  //   fill(175, 16, 19);
  // } else if(randomNum === 3) {
  //   fill(191, 26, 30);
  // } else if(randomNum === 4) {
  //   fill(211, 29, 36);
  // } else {
  //   fill(226, 29, 38);
  // }

  var specialParticle1X = mouseX - random(5, 15)
  var specialParticle1Y = mouseY + random(5, 15)
  var specialParticle2X = mouseX
  var specialParticle2Y = mouseY - random(5, 15)
  var specialParticle3X = mouseX + random(5, 15)
  var specialParticle3Y = mouseY + random(5, 15)
  triangle(specialParticle1X, specialParticle1Y, specialParticle2X, specialParticle2Y, specialParticle3X, specialParticle3Y);

  var minimunDistanceOutsiderPartical = outsiderParticles[0];
  var tempDistanceX = outsiderParticles[0].x - hiddenParticles[i].x
  var tempDistanceY = outsiderParticles[0].y - hiddenParticles[i].y
  var minimunDistance = sqrt(tempDistanceX * tempDistanceX + tempDistanceY * tempDistanceY)

  for(var j = 0; j < outsiderParticles.length; j++) {
    var distanceX = outsiderParticles[j].x - hiddenParticles[i].x
    var distanceY = outsiderParticles[j].y - hiddenParticles[i].y
    var distance = sqrt(distanceX * distanceX + distanceY * distanceY)
    if(distance < minimunDistance) {
      minimunDistance = distance
      minimunDistanceOutsiderPartical = outsiderParticles[j]
    }
  }
  // ellipse(minimunDistanceOutsiderPartical.x, minimunDistanceOutsiderPartical.y, 8);
  // line(minimunDistanceOutsiderPartical.x, minimunDistanceOutsiderPartical.y,
  //   hiddenParticles[i].x, hiddenParticles[i].y);

  cursor(HAND);

  var deltaX = minimunDistanceOutsiderPartical.x - mouseX;
  var deltaY = minimunDistanceOutsiderPartical.y - mouseY;
  var tempDistance = sqrt(deltaX * deltaX + deltaY * deltaY)

  stroke(0)
  line(minimunDistanceOutsiderPartical.x, minimunDistanceOutsiderPartical.y,
    mouseX + 20 * deltaX/tempDistance, mouseY + 20 * deltaY/tempDistance);


  var imageX = minimunDistanceOutsiderPartical.x;
  var imageY = minimunDistanceOutsiderPartical.y;

  if(!hiddenParticles[i].isImageLoaded) {
    if(hiddenParticles[i].socialPost && hiddenParticles[i].socialPost.attachment_url) {
      loadImage(hiddenParticles[i].socialPost.attachment_url, function(img) {
        imageHolderArray[i] = img;
        hiddenParticles[i].isImageLoaded = true;
      });
    }
  };

  // dirty code here:

  var authorInfoHeight = 20;
  var lineSeperator = 20;

  if(imageHolderArray[i]) {
    if (isWestSide(minimunDistanceOutsiderPartical)) {
      image(imageHolderArray[i], imageX - 112 - 228, imageY, 152, 152);
    } else {
      image(imageHolderArray[i], imageX, imageY, 152, 152);
    }
  }


  var s = "";
  if(hiddenParticles[i].socialPost && hiddenParticles[i].socialPost.content) {
    var s = hiddenParticles[i].socialPost.content;
  }

  var textStartPointX;
  var textStartPointY;
  if(imageHolderArray[i]) {
    textStartPointX = imageX + 112;
    textStartPointY = imageY + authorInfoHeight;
  } else {
    textStartPointX = imageX;
    textStartPointY = imageY + authorInfoHeight;
  }

  fill(249, 249, 249);
  noStroke();
  if (isWestSide(minimunDistanceOutsiderPartical)) {
    if(imageHolderArray[i]) {
      rect(textStartPointX - 112 - 228 + 40, textStartPointY + lineSeperator - 40, 228 + 5, 112 + 40);
    } else {
      rect(textStartPointX - 228, textStartPointY + lineSeperator - 40, 228 + 5, 112 + 40);
    }
  } else {
    if(imageHolderArray[i]) {
      rect(textStartPointX + 40, textStartPointY + lineSeperator - 40, 228 + 5, 112 + 40);
    } else {
      rect(textStartPointX, textStartPointY + lineSeperator - 40, 228 + 5, 112 + 40);
    }

  }



  //textFont(fontRegular);
  fill(0);
  textSize(12);
  noStroke();
  // adding 10 and 5 is to add a bit padding in the text box

  if(isWestSide(minimunDistanceOutsiderPartical)) {
    if(imageHolderArray[i]) {
      text(s,textStartPointX + 10 - 112 - 228 + 40 + 4, textStartPointY + 5 + lineSeperator + 5, 218 - 40, 102 - 5);
    } else {
      text(s,textStartPointX + 10 - 228 + 4, textStartPointY + 5 + lineSeperator + 5, 218, 102 - 5);
    }
  } else {
    if(imageHolderArray[i]) {
      text(s,textStartPointX + 10 + 40 + 4, textStartPointY + 5 + lineSeperator + 5, 218 - 40, 102 - 5);
    } else {
      text(s,textStartPointX + 10 + 4, textStartPointY + 5 + lineSeperator + 5, 218 - 40, 102 - 5);
    }

  }

  if(hiddenParticles[i].socialPost) {
    var authorPlatform = hiddenParticles[i].socialPost.platform;
    var tempSocialPost = hiddenParticles[i].socialPost;
    var authorName =  tempSocialPost.user.handle === '' ? tempSocialPost.user.full_name : tempSocialPost.user.handle;
    var authorIcon;
    if(imageHolderArray[i]) {

    }

    var authorIconPositionX;
    var authorIconPositionY = imageY + 10;
    if(imageHolderArray[i]) {
      if (isWestSide(minimunDistanceOutsiderPartical)) {
        authorIconPositionX = imageX - 228 + 40 + 10;
      } else {
        authorIconPositionX = imageX + 112 + 40 + 10;
      }
    } else {
      if (isWestSide(minimunDistanceOutsiderPartical)) {
        authorIconPositionX = imageX - 228 + 10;
      } else {
        authorIconPositionX = imageX + 10;
      }
    }

    switch(authorPlatform) {
      case 'FACEBOOK':
        //authorIcon = facebookIcon;
        break;
      case 'INSTAGRAM':
        //authorIcon = instagramIcon;
        break;
      case 'TWITTER':
        //authorIcon = twitterIcon;
        break;
      default:
        break;
    }
    image(authorIcon, authorIconPositionX, authorIconPositionY, 20, 20);

    //textFont(fontRegular);
    fill(0);
    textSize(15);
    noStroke();
    text(authorName,authorIconPositionX + 23 + 2, authorIconPositionY + 15);

  }

  var seperatorY = imageY + authorInfoHeight + lineSeperator/2;
  var seperatorX = authorIconPositionX;
  var speratorLength;
  fill(0, 0, 0);
  noStroke();
  if(imageHolderArray[i]) {
    speratorLength = 228;
  } else {
    speratorLength = 228;
  }
  rect(seperatorX - 10, seperatorY + 10, speratorLength, 1)

}

function shuffleArray(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function draw() {
  background(229, 229, 229);
  randomSeed(frameCount);
  cursor(ARROW);
  for (var i = 0; i < strayParticles.length; i++) {
    var p = strayParticles[i];
    updateParticle(p);
  }

  for (var i = 0; i < particleSystem.length; i++) {
    var p = particleSystem[i];
    updateParticle(p);
  }

  randomSeed(50);
  noStroke();
  for(var i = 0; i < strayParticles.length; i++) {
    var p = strayParticles[i];
    renderParticle(p, true, 0.2, 0.2);
  }


  // for fun
  shouldLoadP5 = true

  if(forFunIndex >= 0 && shouldLoadP5) {
    for (var i = 0; i < 30; i++) {
      forFunParticleSystem.push(particleSystem[forFunIndex]);
      forFunIndex -= 1;
      if (forFunIndex < 0) {
        shouldAddParticles = true;
        shouldLoadP5 = false;
        break;
      }
    }
  }

  for(var i = 0; i < forFunParticleSystem.length; i++) {
    var p = forFunParticleSystem[i];
    if(windowWidth < 1400) {
      renderParticle(p, false, 0.3, 0.8)
    } else {
      renderParticle(p, false, 0.3, 1.6);
    }
  }

  // plot all hidden particals
  for(var i = 0; i < hiddenParticles.length; i++) {
    var dx = hiddenParticles[i].targetX - mouseX;
    var dy = hiddenParticles[i].targetY - mouseY;
    var d = sqrt(dx * dx + dy * dy);
    if (d < 50) {
      var isPostEnglish = false;
      var isPostFrench = false;
      if(hiddenParticles[i].socialPost) {
        if (hiddenParticles[i].socialPost.tags.length == 2) {
          isPostEnglish = true
          isPostFrench = true
        } else {

          var postTags = hiddenParticles[i].socialPost.tags
          isPostEnglish = postTags[0]['value'] == 'has';
          isPostFrench = postTags[0]['value'] == 'hasa';
        }
      }

      if(!window.isCurrentLanguageEnglish && isPostFrench) {
        showHiddenParticle(i);
        break;
      }

      if(window.isCurrentLanguageEnglish && isPostEnglish) {
        showHiddenParticle(i);
        break;
      }

    }
  }

  // PARTICLES - Stabilizer adding more particles based on frame rate
  var aspectRatio = myImage.width / myImage.height;
  var leafHeight = windowHeight * 0.8;
  var leafWidth = leafHeight * aspectRatio;

  var widthPadding = (windowWidth - leafWidth) / 2;
  var heightPadding = (windowHeight - leafHeight) / 2;

  var leafStartX = widthPadding;
  var leafStartY = heightPadding;
  var leafEndX = leafStartX + leafWidth;
  var leafEndY = leafStartY + leafHeight;

  var counter = 0;
  if (frameRate() > 23 && shouldAddParticles) {
    while(counter < 50) {
      var i = random(leafStartX, leafEndX);
      var j = random(leafStartY, leafEndY);
      var iX = floor(map(i, leafStartX, leafEndX, 0, myImage.width));
      var iY = floor(map(j, leafStartY, leafEndY, 0, myImage.height));
      var r = myImage.pixels[(iX + iY * myImage.width) * 4];
      if (r != 0) {
        var deltaX = random(-5, 5);
        var deltaY = random(-3, 3);
        var tempParticel = particleMaker(i + deltaX, j + deltaY - positionYOffset);
        tempParticel.nearbyParticleNum = -1;
        forFunParticleSystem.push(tempParticel);
        particleSystem.push(tempParticel);
        counter += 1;
      }
    }
  }
}
