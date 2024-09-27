const main = () => {
  /**
   * Function to send a message to parent windows
   */
  const postUrlChange = (newUrl) => {
    try {
      const message = { type: "URL_CHANGED", url: newUrl };
      window.top.postMessage(message, "https://run.gptengineer.app");
      window.top.postMessage(message, "http://localhost:3000");
      window.top.postMessage(message, window.origin);
    } catch (error) {
      console.error("Error posting URL change:", error);
    }
  };

  /**
   * Listen for URL changes using MutationObserver and navigation-related events.
   */
  const observeUrlChange = () => {
    let oldHref = document.location.href;

    const checkUrlChange = () => {
      const newHref = document.location.href;
      if (oldHref !== newHref) {
        oldHref = newHref;
        postUrlChange(newHref); // Call the function to post the URL change
      }
    };

    // Observe DOM changes (Fallback for cases not covered by events)
    const body = document.querySelector("body");
    const observer = new MutationObserver(checkUrlChange);
    observer.observe(body, { childList: true, subtree: true });

    // Add event listeners for navigation-related changes
    window.addEventListener("popstate", checkUrlChange); // Back/forward button
    window.addEventListener("hashchange", checkUrlChange); // Hash changes (e.g., #section)

    // Monkey patch pushState and replaceState to capture URL changes triggered by them
    const originalPushState = history.pushState;
    history.pushState = function () {
      originalPushState.apply(this, arguments);
      checkUrlChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
      originalReplaceState.apply(this, arguments);
      checkUrlChange();
    };
  };

  // Run observeUrlChange when the window is loaded
  window.addEventListener("load", observeUrlChange);
};

// Execute main function (No need for .catch() as this is synchronous)
main();
