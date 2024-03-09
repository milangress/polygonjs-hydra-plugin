//
// learn more about this file on https://polygonjs.com/docs/editor/config
//

import {
	EditorApiOptions,
	ConfigureEditor,
	// @ts-ignore
} from "polygonjs-editor/public/editor/api";

export const configureEditor: ConfigureEditor = (options: EditorApiOptions) => {
	// we have a `console.log` here to avoid errors like 'options is declared but its value is never read' at build time
	if (false) {
		console.log(options);
	}
	//
	// **********************
	// Add custom javascript to the editor
	// **********************
	//
	// options.api.html.head.addScript({
	// 	id: 'my-script',
	// 	content: `alert('this is running my custom script')`,
	// });
	//
	//
	//
	//
	// **********************
	// Start A Multiplayer Session
	// **********************
	//
	//
	// learn more https://polygonjs.com/docs/multiplayer
	//
	// options.api.multiplayer.remote.ngrok.setAuthToken("YOUR-AUTHTOKEN");
	// options.api.multiplayer.remote.ngrok.setCloseExistingTunnelsOnCreate(true);
	//
};
