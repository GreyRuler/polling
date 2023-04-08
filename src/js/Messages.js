// eslint-disable-next-line import/no-extraneous-dependencies
import { ajax } from 'rxjs/ajax';
import {
	catchError,
	concatAll,
	filter,
	interval,
	map,
	of,
	switchMap,
} from 'rxjs';
import MessageView from './MessageView';

export default class Messages {
	static get markup() {
		return `
			<div class="title">Входящие</div>
			<div class="btn btn-primary">Добавить сообщение</div>
			<div class="messages-container"></div>
		`;
	}

	constructor(element) {
		this.element = element;
	}

	render() {
		this.element.innerHTML = Messages.markup;
		this.messagesContainer = this.element.querySelector('.messages-container');
		this.getMessage();
		this.registerEvents();
	}

	registerEvents() {
		const url = 'http://localhost:3000/messages/add';
		const btn = this.element.querySelector('.btn');
		btn.addEventListener('click', () => {
			fetch(url, {
				method: 'POST',
			});
		});
	}

	// eslint-disable-next-line class-methods-use-this
	getMessage() {
		const url = 'http://localhost:3000/messages/unread';
		const oldMessages = [];
		interval(2000).pipe(
			switchMap(() => ajax.getJSON(url).pipe(
				map((response) => [...response.messages]),
				catchError((error) => {
					console.log('error: ', error);
					return of(error);
				}),
			)),
			concatAll(),
			filter((value) => !oldMessages.includes(value.received)),
		).subscribe((message) => {
			oldMessages.push(message.received);
			this.reflectMessages(message);
		});
	}

	reflectMessages(message) {
		const date = new Date(message.received);
		const time = `${date.toLocaleTimeString('ru').slice(0, 5)} ${date.toLocaleDateString('ru')}`;
		this.messagesContainer.insertAdjacentHTML(
			'afterbegin',
			MessageView.markup(
				message.from,
				message.subject,
				time,
			),
		);
	}
}
