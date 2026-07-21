/**
 * 在 React hydration 之前執行，於 <head> 內 inline。
 * 讀 localStorage 的主題並立刻套到 <html data-theme>，避免重整時閃爍（FOUC）。
 * Server Component：純字串，不進 client bundle。
 */
const script = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
