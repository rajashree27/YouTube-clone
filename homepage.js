const url =
	"https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=20&regionCode=IN&key=AIzaSyCQp8bTVEV1FlCryQfS5znOdep62bN2g-w";

const popularVideos = async () => {
	try {
		const res = await fetch(url);

		const data = await res.json();
		appendData(data.items);
		console.log(data.items);
	} catch (err) {
		console.log(err);
	}
};

popularVideos();

let appendData = (data) => {
	let mainDiv = document.getElementById("display-videos");

	data.map(
		({
			id,
			snippet: {
				title,
				thumbnails: {
					medium: { url },
				},
				channelTitle,
			},
			statistics: { viewCount },
		}) => {
			let Thumbnail = document.createElement("img");
			Thumbnail.src = url;
			Thumbnail.setAttribute("class", "thumbnail");

			let Title = document.createElement("h5");
			Title.innerText = title;

			let Channel = document.createElement("p");
			Channel.innerText =
				channelTitle + " • " + Math.floor(viewCount / 1000) + "K views";
			Channel.style = "font-size:12px;color:grey";

			let box = document.createElement("div");
			box.style = "cursor:pointer";
			let videoId = id;
			box.onclick = () => {
				location.href = "https://www.youtube.com/watch?v=" + videoId;
			};

			box.append(Thumbnail, Title, Channel);

			mainDiv.append(box);
		}
	);
};

function showVideo(el) {
	document.getElementById("display-videos").innerHTML = "";
	console.log("hello");
	el.map(({ id: { videoId }, snippet: { channelTitle, title } }) => {
		let box = document.createElement("div");
		box.style = "width:80%;height:auto";

		let iframe = document.createElement("iframe");
		iframe.src = `https://www.youtube.com/embed/${videoId}`;
		iframe.style =
			'width="560";height="315";allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-inpicture";allowfullscreen';

		iframe.allow = "fullscreen";

		channelTitle = " | " + channelTitle;
		box.append(iframe, title, channelTitle);

		document.getElementById("display-videos").append(box);
	});
}

async function searchVideos() {
	try {
		const q = document.getElementById("search").value;

		const res = await fetch(
			`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${q}&key=AIzaSyCQp8bTVEV1FlCryQfS5znOdep62bN2g-w`
		);

		const data = await res.json();

		showVideo(data.items);
		console.log(data.items);
	} catch (err) {
		console.log(err);
	}
}

const debounce = (fn, delay) => {
	let id;
	return function () {
		clearInterval(id);
		id = setTimeout(() => {
			fn();
		}, delay);
	};
};

const searchResults = debounce(searchVideos, 500);
