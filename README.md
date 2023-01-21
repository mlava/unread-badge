This extension allows you to define a tag or page within Roam Research for which you want to monitor the number of Linked References. This can be useful if you import data from other sources, like my Quick Capture with Todoist extension, for example, or with Readwise sync. 

**NEW:**
1. Ctrl-Shift click (or Cmd-Shift-Click on iOS) will open block references in the right sidebar
2. Fix for tags used in Queries adding to count
3. Bug fix in renaming Menu tags

**Recent:**
1. Unread counts should now update immediately, and the frequency to check for unread items settings have been removed from the Roam Depot configuration.
2. CSS fixes for badge and text alignment
3. Change the display name of the tag you're monitoring when using the menu option
4. Monitor a second tag, defining different badge and text colours if desired

Processing that information for its ongoing relevance and relationship with other information in your graph is almost as important as capturing it! When you process that item, remove the tag you're monitoring and it will no longer contribute to the count of 'unread' items.

The extension will monitor how many linked refs you have that you haven't 'processed' and display a badge with an 'unread' number. You can choose whether the extension creates a menu item for the left sidebar, or whether it looks for a shortcut.

Menu mode:

![image](https://user-images.githubusercontent.com/6857790/187310552-791b815c-8628-4b61-b7d3-9ceccc1ecb21.png)

Shortcut mode:

![image](https://user-images.githubusercontent.com/6857790/187310485-6a59279d-f2c8-4cba-878b-ac06d9b0aa61.png)

If you choose shortcut option, make sure you've starred that page as a shortcut in the Roam Research menu - click add to shortcuts as seen in the image below:

![image](https://user-images.githubusercontent.com/6857790/187310681-7e6d6986-bf2b-4841-9c3e-a48f40b13980.png)

You can configure the background colour and text colour for the badge. For the menu item you can configure which of the blueprintjs icons to use from the list at: https://blueprintjs.com/docs/#icons

Finally, you can offset the unread count if you don't want to include references to this tag from certain pages. Similar to using the inbuilt Roam Research filter option, if there are some pages that won't be relevant to the count, you can set an offset to be subtracted from the count.

![image](https://user-images.githubusercontent.com/6857790/187310923-0519dfea-5e41-4889-bbd6-4cb78d411562.png)

In this image, I have filtered a couple of pages out of my Linked References, and you can see it says '5 of 7 linked references'. I set my offset to 2 which means the unread badge shows the correct number.
