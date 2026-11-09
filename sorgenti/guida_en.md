## inizio | How the app works

The app is for writing a text adventure and turning it into a game for the Web, the Commodore 64 and the ZX Spectrum. Everything you write ends up in a single data file, the **core**: rooms, objects, the words the game understands and the rules. There is one core for all languages and all platforms.

At the top are the **↶** (undo) and **↷** (redo) buttons, **?** which opens this guide at the section for the tab you are on, **IT/EN** for the app language and **◐** for the light or dark theme. Below are the tabs, in the order you usually work:

| Tab | What it is for |
| --- | --- |
| Rooms | Places, descriptions, exits, the game's title and introduction |
| Map | A drawing of the rooms and how they connect |
| Objects | Things, containers, characters, topics |
| Words | Commands, directions, linking words, response texts |
| Rules | What happens when the player does something, ready-made templates, events, variables |
| Solution | The steps to win and the automatic check |
| Languages | Base language and translations |
| Checks | Errors, warnings and memory used |
| Play | Play right away, inside the app |
| Build | The finished game for Web, C64 and Spectrum |
| Core | Projects, .json files, the full core |
| Guide | This guide |

**A good first tour:** open Play and try the example "The Empty House" (La casa vuota) for a few minutes. Then look at the Rooms, Objects and Rules tabs: everything you saw in the game has its card there. Finally create a project of your own (next section).

## core | Projects, saving and Undo

Each adventure is a separate project, saved automatically in this browser at every change. Projects are managed in the **Core** tab, at the top, under "Your projects".

- **New empty project**: a single room and the basic Italian vocabulary.
- **New empty project in English**: the same, with English words and responses.
- **New from the example**: a copy of "The Empty House" to take apart and change.
- **Duplicate the open one**: a copy to try a variant without risk.
- Each project in the list has **Open** and **Delete** (with confirmation).

The project name is the game's title. You change it in the **Rooms** tab, in the "Title and introduction" box at the top, where you also write the text shown once at the start of the game.

**Undo and Redo.** The ↶ and ↷ buttons at the top undo and redo the changes to the open project, one at a time. Each project has its own history.

**Backups.** The data live only in the browser: if you clear the site data or change phone, they are gone. In the Core tab, use **Save to a file (.json)** now and then. **Open from a file…** brings a copy back; the app asks before replacing the open core, and "Back to the previous core" undoes the replacement.

## stanze | Rooms and map

A room has a name, a description and exits. Tap **+ New room** at the bottom of the Rooms tab, then open its card to write.

**Exits.** With **+ Add exit** you choose the direction and the destination room. Right below appears **Create exit in the linked room**: press it when direction and room are right, and the app also creates the way back (north ↔ south, up ↔ down). If the way back already exists you see a ✓; if that direction in the other room leads elsewhere, the app leaves it alone. The ✕ button removes the exit.

**Conditional exits.** Every exit has a "Free exit" box. With **Make the exit conditional** it becomes a passage that can be used only when all its conditions are true, for example "the door is open" or "the lantern is lit". Then you can:

- write the sentence shown when the player tries to go through ("If blocked, say");
- keep it **hidden** until the conditions are true, so it does not appear among the exits;
- add a sentence to the description when the exit becomes available, for example "You notice a passage behind the shelves".

**Description fragments.** Pieces of text added to the room description only when their conditions hold. They are for changes: "A key stands out on the table" as long as the key is there.

**Dark room.** With the "Dark room" checkbox the room can be seen only if there is a light on in the room or in the player's hands. Without light the player reads "It is pitch black", cannot see the objects and cannot take them, but can still move. The light is an object with "Gives light when lit" (Objects section).

**Image.** With **+ Upload image** you give the room an image, even a small one: the Web game shows it inside the text when the room is described: above the text, or at the side with the text flowing around it; you also choose the width. For C64 and Spectrum you choose how many columns and rows it takes, the mode, the colours (also black and white: with greys on the C64, only black and white on the Spectrum) and the dithering, and you see the screen as it will look and how much memory it needs. On C64 and Spectrum the image sits at the top and the text scrolls below it (on the C64 separated by a black line); when the image changes the screen is cleared, and if there is new text to read it first waits for a key. The taller the image, the fewer rows are left for text. Saving the project to a file takes the images with it.

**Starting room.** One room has the "start" mark: the game begins there. You change it with **Start the game here**, and the starting room cannot be deleted.

**Map.** The Map tab draws the rooms and their connections. A solid line is a free passage; a dashed one is an exit with conditions, blocked or hidden; an arrow means one-way. Rooms further up or down (up and down) are on separate levels. Tap a room to open it.

## oggetti | Objects

An object is anything the player can name: a key, a door, a table, a person, even a topic to talk about. Create one with **+ New object** in the Objects tab.

**The basic fields**

- **Name**: the word the player types, for example "key". **Other names**: synonyms separated by commas.
- **Adjectives**: they tell apart two objects with the same name, "rusty key" and "golden key". If the player types just "key" and there are two, the game asks "Which one do you mean?".
- **How it appears in the list**: the text in "You can see: …", with the article, for example "a rusty key".
- **Description**: what the player reads with "look at key".
- **Where it is at the start**: a room, "with you", or inside a container.
- **Can be taken**: without this box the object stays where it is (a table, a door).
- **Show it in the "You can see" list**: untick it when the object is already mentioned in the room description. It appears in the list again once the player moves it.

**If it changes state.** An object can be open or closed, lit or unlit: rules change that. For each state you can give a different label and description, for example "an open door", "a lit lantern".

**Image.** An object or character can have an image, like rooms. In the Web game it appears before the answer when the player uses on the object one of the commands that show images: only "look" by default; the others (for example "talk") are chosen in the Words tab, Commands section. On C64 and Spectrum the object image replaces the room image at the top until the room is described again (for example with "look"); an object without an image leaves the screen as it is.

**The special kinds**

| Kind | What it does |
| --- | --- |
| Container | Other objects can be put inside ("put key in box"). If it "opens and closes", its contents are visible only when open. |
| Character | Listed separately ("Here is an old gardener") and cannot be taken. You can talk to it, give it things, ask it about a topic. |
| Topic | Something you can talk about even if it is not there ("ask about house"). It is in no room and cannot be seen. |
| Gives light | With "Gives light when lit" the object lights up dark rooms, if it is lit and within reach. |
| All | The special word of "take all" and "drop all". New projects already have it: leave it as it is. |

When words are missing from the vocabulary ("put", "in", "to", "about"), the object's card says so and offers **+ Add them**.

## parole | Words and response texts

The Words tab says which words the game understands and which sentences it answers with. Each entry is a list of words separated by commas.

**Commands.** Commands marked "basic" are built into the engine: look, go, take, drop, inventory, put, wait, again, help. You can add words to each one ("take, get, grab") but not remove them. New commands ("open", "use", "talk"…) are added at the bottom of the list and work only when you connect them to a rule. Without a rule they answer "Nothing happens".

If the project is old and "wait", "again", "help" or the word "all" are missing, a box with **+ Add them** appears above the commands.

**Directions.** For each direction, the player's words ("north, n") and how it is written in the list of exits.

**Ignored and linking words.**

- **Ignored words**: articles and filler words ("the, a, an, please"). The game skips them.
- **Words that join two objects**: "with, in, into, to, about". They separate the first object from the second in "open door with key", "give apple to gardener", "ask about house".

**Response texts.** The sentences the game uses by itself: "I don't understand.", "Taken.", "You can see: {0}.", "It is pitch black", the "help" text. Where there is **{0}**, the game puts a name or a list in its place: keep it in the sentence. A text you leave untouched follows the project's base language.

## regole | Rules and templates

A rule says what happens when the player types a certain command. It is the heart of the game: doors that open, lanterns that light up, characters that answer, the ending.

**The four parts of a rule**

1. **When the player types**: the command, the object and, if needed, a second object ("open door with key"). Leaving the object on "(any)" makes it valid for all.
2. **Only if**: the conditions, which must all be true. For example "the key: you have it with you", "you are in the room Kitchen", "the variable attempts is at least 2". With no conditions the rule always applies.
3. **Then**: the actions, in order. Say a text, move an object (to a room, to the player, or out of the game), open, close, light, put out, describe the room again, change a variable, end the game.
4. **Otherwise**: an optional sentence for when the command matches but the conditions are not true ("You need to take the key first").

**Order matters.** The game tries the rules from top to bottom and uses the first that matches. If the conditions are not true and the rule has no "Otherwise", it moves on to the next. So specific rules go above general ones. To move a rule use the **Move to…** menu, which lists every position ("Before 5: talk gardener"); ↑ Up and ↓ Down move it one place. The Checks panel warns when a rule can never fire.

**Templates.** The **New rule from template** box creates in one go the rules for common situations: choose the template, fill in a few fields, look at the preview and press Create. The result is ordinary rules, to adjust like any other. If there are already rules for the same sentence, the new ones go right before them, so they really fire.

| Template | Example |
| --- | --- |
| Open or unlock with another object | The door and the key |
| Turn on and off | The lantern, with the room described again |
| Container that opens and closes | The toolbox |
| Talk to a character | Different answers the first, second and third time |
| Give an object to a character | The apple to the gardener, who gives you something back |
| Ask a character about a topic | "ask about house" |
| A character blocking an exit | The guard who steps aside when you talk to it or give it something |
| Eat, drink or use up | The apple that disappears |
| An object that cannot be taken | "It's far too heavy" |
| Use an object | With another object, only in one room, with a result of your choice |
| Combine two objects | "combine rope with hook": both disappear and a new one is made (it starts "out of the game") |
| The game ends when… | Dropping the coin in the kitchen |
| A special answer to a command | Your own sentence for "listen" or "jump" |

## variabili | Variables and entry events

They are in the Rules tab: variables in the box at the top, entry events below the list of rules.

**Variables.** A variable is a number from 0 to 255 that the game remembers: attempts made, points, how many times you have talked to someone. It has a name, a starting value and a maximum. Rules change it with the actions "set", "increase" and "decrease", and test it with the conditions "equals", "does not equal", "is at least", "is at most". In the example, the locked door counts the attempts and gives a hint after two. To delete a variable, first remove the conditions and actions that use it.

**Entry events.** An event is a rule that fires by itself when the player enters a room, right after the description. You choose the room (or "every room"), whether it applies **only the first time**, the conditions and the actions. They are for scenes: a shiver going down to the cellar, a character greeting you, a trap. Events have "Move to…" too, because they fire in list order.

## soluzione | Solution and verification

The Solution tab holds the steps to win, at a high level: not the exact commands, but the things to achieve, in order. The solution stays in the core and never goes into the built game.

**Kinds of step:** Take an object · Reach a room · Bring an object to a room · Reach a state ("the lantern is lit") · A variable reaches a value · End of the game. Each step can have a note ("In the shed, inside the toolbox"). Steps are added with **+ Add step** and reordered with "Move to…".

**Verify the solution.** The app plays every possible game with the same engine as the game and answers with:

- ✓ the solution works, with the path of commands that achieves it ("Show the path's commands"); or ✗ which step cannot be reached in any way;
- the check for **dead ends**: situations from which the game can no longer be finished, for example an essential object used up too early;
- how many game situations it explored.

The check has a limit of time and situations (about 60,000). A very large game can exceed it: in that case the app says the check is incomplete. Every variable that counts something multiplies the possible situations, so use them sparingly.

## lingue | Languages and translations

One core serves all languages: rooms, objects, rules and solution stay the same, and each language changes only texts and words. Every built game has a single language, chosen in the Play and Build tabs. For now the game languages are Italian and English. (The game language is independent of the app language, which you change with IT/EN at the top.)

**Base language.** The language you write the core in. It decides the game's default responses and the word for restarting. If you change it, the responses you have not touched switch to the new language and your own texts stay as they are.

**Adding a translation.** With **+ Add the translation into…** you get the list of all the game's texts, grouped (title and introduction, rooms, objects, rules, events, responses), and of the vocabulary. You can translate by hand field by field, or get help from a language model:

1. **Copy** the translation request (or save it to a file) and paste it into the chat with the model. The instructions are already inside.
2. The model answers with the same text, filled in.
3. Paste the answer into **Reply to import**, check the preview ("Ready to import: …") and press **Import**. Cancel goes back.

**Keeping the translation up to date.** If you change an original text after translating it, its translation becomes "to review". When the translation is still fine, press **The translation is still fine**. With "Only texts to translate or review" you see only what is missing. The Checks panel shows the translated percentage.

**Translated vocabulary.** Commands, directions and object words have their own words in each language. **+ Fill in with suggested words** fills those the app already knows. For phrasal verbs ("pick up", "look at") write only the verb: the particle is already a word the game skips or a direction.

## controlli | Checks

It gathers in one place all the problems of the core, at three levels: **errors** that stop the game from working, **warnings** about things you probably did not mean, **information**. Examples: rooms that cannot be reached, objects that are never found, rules that never fire, duplicate words, texts too long for the screen of vintage computers, incomplete translations.

Each item has **Go**, which opens the place to fix. "Only errors and warnings" hides the information. At the bottom is the **memory** used on the C64 and the Spectrum, for each language.

## prova | Play and Build

**Play.** Here you play the open core right away, with the same engine as the final game. If there is a translation, choose the language at the top. With the **Start from** menu the test begins in another room, so you can reach the later parts at once: objects stay where you put them at the start, and the choice does not change the game. Below the log are quick commands (the exits, look, inventory), handy on a phone; if the game has variables, their values are shown underneath. To start again, type "restart" (or "ricomincia" in Italian) at the end of the game.

**Build.** Turns the core into a game to share, in the chosen language. The solution is never included.

| Platform | What you get | How to use it |
| --- | --- | --- |
| Web | A single .html file with engine and data | Opens in any browser, even offline. There is a preview too. If saving fails, "Copy the code" and paste it into an .html file |
| Commodore 64 | A zip with the .prg | Load it in an emulator (VICE) or on MiSTer, then RUN |
| ZX Spectrum | A zip with the .tap | Load it in an emulator or on MiSTer with LOAD "" |

For each platform the app shows the size and how much memory is left.

**Options for C64 and Spectrum.** Above the two retro platforms, the options box chooses how the text scrolls: **in blocks** (each response appears all at once, with a single jump) or **one line at a time** (like BASIC). Either way, if a response is longer than the screen the game stops and waits for a key. The tick "After the introduction, wait for a key" stops the game after the title and the introduction, before the first room. The pause sentence ("[press a key]") is changed in the Words tab, among the response texts. The options are saved in the project.

**Core.** Besides the projects, the Core tab shows the whole core as JSON. The other tabs edit every part of it; here you can read it, touch it up by hand (for example to change many things at once) and press **Apply**, which checks it. **Copy** copies it to the clipboard; **Restore the example** puts "The Empty House" back into the open project.

## giocatore | What the player can type

The game understands short sentences: a command, an object and, if needed, a second object. Articles and filler words are skipped, and capitals and accents do not matter. Here are the English words; Italian games use the Italian ones.

| The player types | What happens |
| --- | --- |
| north, n, go south, up, down | Moves in that direction |
| look (l) | Describes the room again |
| look at key, examine key (x) | Describes the object |
| take key, drop key | Takes or drops an object |
| take all, drop all | Takes every object in the room, or drops everything carried |
| inventory (i) | Lists what you are carrying |
| put key in box | Puts an object in an open container |
| take golden key, take rusty key | Adjectives choose between objects with the same name |
| open door with key | A command with two objects (works if there is a rule) |
| give apple to gardener, talk to gardener | Characters (with rules) |
| ask about house, ask gardener about house | Conversation topics |
| wait (z) | "Time passes." |
| again (g) | Repeats the last command |
| help | Shows the help text |
| restart | At the end of the game, starts over |

A word the game does not know produces "I don't know the word "…"": that is the signal to add it as a synonym in the Words or Objects tab.

## consigli | Limits and tips

**Current limits**

- **Memory:** about 38 KB on the C64 and 28 KB on the Spectrum for program, font and data. The Checks panel shows how much you use. Large adventures will come with loading from disk (.d64) and text compression.
- **Command line:** at most 28 characters on the Spectrum; longer commands are cut.
- **Variables:** at most 64 on the retro machines, including the ones the app uses for "only the first time" events.
- **No saved games** for now, and only entry events: no timed events yet, no characters moving on their own, no menu dialogues.
- **Game languages:** Italian and English; each built game has only one.

**Tips**

1. Work in small steps: a room, an object, a rule, and test right away in the Play tab.
2. After each puzzle update the Solution and press **Verify**: you find dead ends at once.
3. Use the rule **templates** instead of writing everything by hand, then adjust the texts.
4. Give every object a few synonyms and, when two things share a name, an adjective.
5. Look at the **Checks** panel before building.
6. Save the core to a .json file from the Core tab now and then: it is your backup.
7. Try the built game on C64 and Spectrum too: line breaks and long words show only there.
