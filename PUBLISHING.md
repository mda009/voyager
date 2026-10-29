# Publishing Voyager online

This puts the Voyager Windows installer and the folder zip on a public download page. GitHub builds the installer on its own Windows machines, so you don't need any build tools on your PC. Hosting is free for a public repository.

When it's set up you get the following. For your own domain such as voyagercommand.com, see "Your own domain" at the end.
- a **public website for your viewers** at `https://<your-github-name>.github.io/<repo-name>/` showing giveaways, winners, goals and leaderboards (see "Public website" below)
- an app download page at `https://<your-github-name>.github.io/<repo-name>/download/`
- the installer at `https://github.com/<your-github-name>/<repo-name>/releases/latest`
- automatic updates for everyone who installed the app

## One-time setup (about 15 minutes)

1. **Create a GitHub account** at https://github.com if you don't have one.
2. **Create a repository.** Click **+** > **New repository**.
   - Name it, for example `voyager`.
   - Choose **Public**. Public is needed for free downloads, the download page, and updates without signing in.
   - Leave every "Add …" option unticked.
3. **Upload a fresh copy of this package**, not your live streaming folder. Unzip `Voyager_Giveaway-2.9.0.zip` into a new folder such as `Documents\Voyager-source`. Your live folder holds your real `config.js` password. The easiest way to upload is GitHub Desktop (https://desktop.github.com):
   - File > **Add local repository** > choose this `Voyager_Giveaway` folder.
   - When it says this isn't a Git repository, choose **create a repository**.
   - Commit everything, then **Publish repository** to the repository you created.
   - Untick "Keep this code private" if you made it public.
4. **Turn on the download page.** In the repository on GitHub, open **Settings** > **Pages**. Under "Build and deployment", set **Source** to **GitHub Actions**.

**Before publishing, check `config.js` has no password.** It must say `password: ""`. Your real password belongs only in the copy on your streaming PC, or in `%APPDATA%\Voyager\config.js` for the app. If a password slips in, the release build stops with a warning.

## Publish a version

1. On GitHub, open the **Actions** tab > **Desktop release** > **Run workflow** > **Run workflow**.
2. Wait about 10 minutes. The run will:
   - run all of Voyager's tests;
   - build the folder zip and the Windows installer;
   - start the built app on a Windows machine and check that it works;
   - publish release `v2.9.0` with the installer, the zip and the update files;
   - update the download page.
3. When the run shows a green tick, your download page and release are live.

If any step fails, nothing is published. Open the failed run to see which step failed and why.

## Publish the next version

1. Make your changes.
2. Raise the version number in **three places**, all the same, for example `2.9.1`:
   - `desktop/package.json`
   - `Voyager_Versus/package.json`
   - a new `## 2.9.1 (date)` section at the top of `CHANGELOG.md`, describing the changes (this becomes the release notes)
3. Commit and push in GitHub Desktop, then run **Desktop release** again.

Installed apps find the new version within 15 seconds of starting, download it in the background and install it when Voyager is quit. Tray > **Check for updates** checks straight away.

## Good to know

- **Windows SmartScreen.** Until the installer is code-signed, Windows shows "Windows protected your PC" on first run, and the download page tells people to choose More info > Run anyway. Signing needs a code-signing certificate, which costs money; it can be added to the build later.
- **Private repository.** Builds still work, and every run keeps the installer for 30 days under **Artifacts** for you to download. Public downloads, the download page and automatic updates need a public repository.
- **Test without publishing.** Run **Desktop release** with "Publish a GitHub Release" unticked. It builds and self-tests, and the files appear under the run's **Artifacts**.

## Public website for viewers

The viewer site shows:
- active giveaways and the chat command to enter
- recent winners (only after you confirm them)
- the Silver, Gold and Platinum community goals
- the Voyager points and Versus pilot leaderboards
- Voyager Versus status
- how the program works

It never shows viewer, follower or subscriber counts, watch time, revenue, user IDs, chat, security data or anyone's ticket balance.

**How it updates.** While Voyager runs, it uploads a small public data file to a `public-data` branch of your repository: at most once a minute, and only when something changes. The site reads that file, so viewers see changes within about 5 minutes. When you quit Voyager, the site shows "last updated" with a note that the stream tools are offline.

### Set it up (once)
1. Do the one-time setup above, so the repository exists and Pages is set to **GitHub Actions**.
2. On GitHub, open **Actions** > **Public website** > **Run workflow**. This puts the site online. It runs again by itself whenever you change files in `site/`.
3. Create a token that can only update this one repository:
   - GitHub > your picture > **Settings** > **Developer settings** > **Personal access tokens** > **Fine-grained tokens** > **Generate new token**.
   - **Repository access:** Only select repositories > choose your Voyager repository.
   - **Permissions:** Repository permissions > **Contents: Read and write**. Leave everything else at No access.
   - Pick an expiry. When it expires, Voyager shows "GitHub rejected the token" and you make a new one.
   - Copy the token. It starts with `github_pat_`.
4. In Voyager Control, open **Public website** in the sidebar:
   - Under **Put it online**, enter the repository (for example `your-name/voyager`) and paste the token.
   - Tick **Publish while Voyager is running**, then **Save publishing**.
   - The token is saved only on this PC and is never shown again or sent anywhere except GitHub.
5. Under **What is shared**, choose the sections, and whether to show viewer names (off shows `N•••••`). Fill in your channel links, tier descriptions and commands, then **Save**. The preview on that page is exactly what viewers will see.
6. Post the link (shown at the top of the page) in your Twitch panels, Discord or a chat command.

**Keep it updating:**
- With the Voyager app, nothing else is needed; it keeps the website fed in the background.
- With START-VOYAGER-CONTROL.bat, keep the **Public website** page open in a browser tab or as an OBS dock while you stream.

## Put the site on www.theunprofessionalsgroup.com

Your store runs on Fourthwall, which can't host the Voyager files itself. The site stays on GitHub Pages (free), and you connect it to your domain in two ways. Do part A, part B, or both (recommended).

### A. Its own address: voyager.theunprofessionalsgroup.com
1. In your GitHub repository, open **Settings** > **Pages**. Under **Custom domain**, enter `voyager.theunprofessionalsgroup.com` and click **Save**.
2. Sign in where your domain's DNS is managed. That's the domain provider where you bought theunprofessionalsgroup.com, the same place Fourthwall's records were added. Add one record:

   | Type | Name / Host | Value / Target | TTL |
   |---|---|---|---|
   | CNAME | `voyager` | `<your-github-name>.github.io` | default |

   Use your GitHub user name, without the repository name and without `https://`. **Leave the existing `www` and `@` records alone**: those run your Fourthwall store.
3. Wait until GitHub's Pages settings say **DNS check successful**. This is usually minutes, but can take up to a day. Then tick **Enforce HTTPS**.
4. Recommended: in your GitHub account **Settings** > **Pages**, **Add a domain** and verify `theunprofessionalsgroup.com`. This stops anyone else from using a subdomain of yours on GitHub Pages.
5. In Voyager Control > **Public website** > **Put it online**, enter `https://voyager.theunprofessionalsgroup.com` as **Your own web address**, then **Save publishing**.

Viewers can now go to https://voyager.theunprofessionalsgroup.com. The app download page is at https://voyager.theunprofessionalsgroup.com/download/.

### B. A Voyager page inside your Fourthwall store
After you save your web address (or your repository, if you skipped part A), the **Public website** page shows **Add it to your Fourthwall store** with code made for your site.
1. Click **Copy code**.
2. In Fourthwall, open **Site design** > **Layout**, open the page drop-down and choose **Create page**. Name it `Voyager`.
3. Click **Add page section** > **Custom code**, paste the code, tick **Full width**, and save.
4. Add the Voyager page to your store's menu.

The embedded version leaves out its own header, because your store already has one, and the frame grows to fit the content. If Fourthwall ever strips the script part of the code, the page still works with a scroll bar inside the frame. Fourthwall's **Embedded Section** with the address `https://voyager.theunprofessionalsgroup.com/?embed=1` works too.

## Your own domain: voyagercommand.com on Cloudflare (recommended)

Cloudflare registers the domain at cost (about US$10.46 a year for a .com, with free privacy protection) and hosts the website free. The free plan has unlimited traffic and allows commercial use. Your GitHub repository stays where everything is built, and the live giveaway data still comes from it. Only the website moves to Cloudflare.

Domain: **voyagercommand.com**. Search the name without `www.`; the `www` address is added in step 3. If Cloudflare says it isn't available, look it up at https://lookup.icann.org to see whether it's registered, premium or reserved.

### 1. Register the domain (about 5 minutes)
1. Create a free account at https://dash.cloudflare.com/sign-up.
2. In the dashboard, open **Domain Registration** > **Register Domains**, search `voyagercommand.com` and buy it. Turn on auto-renew. Cloudflare sets up its DNS automatically.

### 2. Let GitHub publish to Cloudflare (about 5 minutes)
1. In Cloudflare, click your profile icon > **My Profile** > **API Tokens** > **Create Token**. Use the **Edit Cloudflare Workers** template.
   - **Account Resources:** your account.
   - **Zone Resources:** `voyagercommand.com`.
   - Click **Continue to summary** > **Create Token**, and copy the token.
2. Copy your **Account ID**. It's on the right of **Workers & Pages** > **Overview** in the dashboard.
3. In your GitHub repository, open **Settings** > **Secrets and variables** > **Actions** > **New repository secret**, and add two secrets:
   - `CLOUDFLARE_API_TOKEN`: the token
   - `CLOUDFLARE_ACCOUNT_ID`: the Account ID
4. On GitHub, open **Actions** > **Public website** > **Run workflow**. When it finishes, the site is live on a temporary Cloudflare address (`voyager-site.<your-account>.workers.dev`).

From now on, website changes and new releases publish to Cloudflare automatically. Without those two secrets, the workflow keeps using GitHub Pages.

### 3. Connect voyagercommand.com (about 2 minutes)
1. In Cloudflare, open **Workers & Pages** > **voyager-site** > **Settings** > **Domains & Routes** > **Add** > **Custom domain**. Enter `voyagercommand.com` and add it.
2. Repeat for `www.voyagercommand.com`.
3. Cloudflare creates the DNS records and the HTTPS certificate itself. This usually takes a few minutes.

### 4. Point Voyager at it
In Voyager Control > **Public website** > **Put it online**, set **Your own web address** to `https://voyagercommand.com`, then **Save publishing**. The **Copy code** box for your Fourthwall store updates to the new address. If you already added the Voyager page to Fourthwall, paste the new code there once.

Viewers can now go to:
- https://voyagercommand.com: giveaways, winners, goals and leaderboards
- https://voyagercommand.com/download/: the Voyager app

**Embedding:** the site lets only theunprofessionalsgroup.com (and Fourthwall's editor preview) show it in a frame, so other sites can't pass it off as their own. To allow another site, add a repository variable `VOYAGER_EMBED_ORIGINS` (Settings > Secrets and variables > Actions > Variables) with a comma-separated list, for example `https://theunprofessionalsgroup.com,https://www.theunprofessionalsgroup.com,https://*.fourthwall.com,https://example.com`. Then run **Public website** again.

**If you used GitHub Pages before:** remove the custom domain in the repository's **Settings** > **Pages**, or leave Pages unused. Only one host is needed.
