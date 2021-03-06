window.addEventListener("DOMContentLoaded", async function() {
    async function get(url) {
      const resp = await fetch(url);
      const json = await resp.json();
      return json;
    }
    const emojis = await get("https://api.github.com/emojis");
    const colors = await get("https://raw.githubusercontent.com/ozh/github-colors/master/colors.json");
    for (const el of document.querySelectorAll(".repo-card")) {
      const name = el.getAttribute("data-repo");
      const theme = {
        background: "transparent",
        borderColor: "#fff",
        color: "#fff",
        linkColor: "#fff",
      };
      el.innerHTML = `
      <div style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji; border: 1px solid ${theme.borderColor}; border-radius: 1px; background: ${theme.background}; padding: 16px; font-size: 14px; line-height: 1.5; color: #24292e;">
      <div style="display: flex; align-items: center;">
      <h4>Loading...</h4>
      </div></div>
      `;
      const data = await get(`https://api.github.com/repos/${name}`);
      data.description = (data.description || "").replace(/:\w+:/g, function(match) {
        const name = match.substring(1, match.length - 1);
        const emoji = emojis[name];
        if (emoji) {
          return `<span><img src="${emoji}" style="width: 1rem; height: 1rem; vertical-align: -0.2rem;" alt="${name}"></span>`;
        }
        return match;
      });
      el.innerHTML = `
      <div style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji; border: 1px solid ${theme.borderColor}; border-radius: 1px; background: ${theme.background}; padding: 16px; font-size: 14px; line-height: 1.5; color: #24292e;">
        <div style="display: flex; align-items: center;">
          <img src="/icons/github.png" style="width:16px">
          <span style="font-weight: 600; color: ${theme.linkColor};">
            <a style="text-decoration: none; color: inherit;" href="${data.html_url}"> &nbsp; ${data.name}</a>
          </span>
        </div>
        <div style="display: ${data.fork ? 'block' : 'none'}; font-size: 12px; color: ${theme.color};">Forked from <a style="color: inherit; text-decoration: none;" href="${data.fork ? data.source.html_url : ''}">${data.fork ? data.source.full_name : ''}</a></div>
        <div style="font-size: 12px; margin-bottom: 16px; margin-top: 8px; color: ${theme.color};">${data.description}</div>
        <div style="font-size: 12px; color: ${theme.color}; display: flex;">
          <div style="${data.language ? '' : 'display: none'}; margin-right: 16px;">
            <span style="width: 12px; height: 12px; border-radius: 100%; background-color: ${data.language ? colors[data.language].color : ''}; display: inline-block; top: 1px; position: relative;"></span>
            <span>${data.language}</span>
          </div>
          <div style="display: ${data.stargazers_count === 0 ? 'none' : 'flex'}; align-items: center; margin-right: 16px;">
            <svg style="fill: ${theme.color};" aria-label="stars" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
            &nbsp; <span>${data.stargazers_count}</span>
          </div>
          <div style="display: ${data.forks === 0 ? 'none' : 'flex'}; align-items: center;">
            <svg style="fill: ${theme.color};" aria-label="fork" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
            &nbsp; <span>${data.forks}</span>
          </div>
        </div>
      </div>
      `;
    }
  });
