export default class MessageView {
	static markup(email, content, time) {
		return `
			<div class="message">
				<div class="email" title="${email}">${email}</div>
				<div class="content" title="${content}">${content}</div>
				<div class="time">${time}</div>
			</div>
		`;
	}
}
