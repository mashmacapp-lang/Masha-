let sb = null;

const $ = (id) => document.getElementById(id);

function log(message) {
  $("log").textContent += "\n" + message;
}

async function test() {
  $("log").textContent = "";

  if (!window.supabase) {
    log("ERROR: Supabase library sinakweza.");
    return;
  }

  const url = $("url").value.trim();
  const key = $("key").value.trim();

  if (!url || !key) {
    log("ERROR: Lembani Project URL ndi Publishable/anon key.");
    return;
  }

  try {
    sb = window.supabase.createClient(url, key);

    log("OK: Supabase library yapezeka.");

    // SHOW ACCOUNT TEST IMMEDIATELY
    $("auth").classList.remove("hide");

    // Test connection separately
    try {
      const { data, error } = await Promise.race([
        sb.auth.getSession(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Supabase connection timeout.")), 8000)
        )
      ]);

      if (error) {
        log("AUTH ERROR: " + error.message);
      } else {
        log("OK: Supabase connection yagwira ntchito.");
        log(
          data.session
            ? "OK: Pali login session."
            : "OK: Palibe login session."
        );
      }
    } catch (e) {
      log("AUTH TEST: " + (e.message || e));
    }

    // Show storage section only if bucket exists
    try {
      const { data: buckets, error } = await sb.storage.listBuckets();

      if (error) {
        log("STORAGE ERROR: " + error.message);
      } else if ((buckets || []).some(b => b.name === "mashmac")) {
        $("storage").classList.remove("hide");
        log("OK: Bucket 'mashmac' yapezeka.");
      } else {
        log("STORAGE ERROR: Bucket 'mashmac' sapezeka.");
      }
    } catch (e) {
      log("STORAGE TEST: " + (e.message || e));
    }

  } catch (e) {
    log("ERROR: " + (e.message || e));
  }
}

$("save").onclick = () => {
  localStorage.setItem("murl", $("url").value);
  localStorage.setItem("mkey", $("key").value);
  test();
};

$("signup").onclick = async () => {
  if (!sb) {
    $("authmsg").textContent = "ERROR: Dinani Save & Test kaye.";
    return;
  }

  const email = $("email").value.trim();
  const password = $("password").value;

  if (!email || !password) {
    $("authmsg").textContent = "ERROR: Lembani email ndi password.";
    return;
  }

  try {
    const r = await sb.auth.signUp({
      email: email,
      password: password
    });

    if (r.error) throw r.error;

    $("authmsg").textContent = r.data.session
      ? "SUCCESS: Account yapangidwa."
      : "SUCCESS: Signup yatheka; yang'anani email confirmation.";
  } catch (e) {
    $("authmsg").textContent = "ERROR: " + e.message;
  }
};

$("login").onclick = async () => {
  if (!sb) {
    $("authmsg").textContent = "ERROR: Dinani Save & Test kaye.";
    return;
  }

  try {
    const r = await sb.auth.signInWithPassword({
      email: $("email").value.trim(),
      password: $("password").value
    });

    if (r.error) throw r.error;

    $("authmsg").textContent = "SUCCESS: Walowa bwino.";
  } catch (e) {
    $("authmsg").textContent = "ERROR: " + e.message;
  }
};

$("upload").onclick = async () => {
  try {
    const f = $("file").files[0];

    if (!f) {
      throw Error("Sankhani file kaye.");
    }

    const userResult = await sb.auth.getUser();
    const user = userResult.data.user;

    if (!user) {
      throw Error("Uyenera kulowa kaye.");
    }

    const path = user.id + "/" + Date.now() + "_" + f.name;

    const r = await sb.storage
      .from("mashmac")
      .upload(path, f);

    if (r.error) throw r.error;

    $("storagemsg").textContent =
      "SUCCESS: Upload yagwira ntchito.";

  } catch (e) {
    $("storagemsg").textContent =
      "ERROR: " + e.message;
  }
};

$("url").value = localStorage.getItem("murl") || "";
$("key").value = localStorage.getItem("mkey") || "";

if ($("url").value && $("key").value) {
  test();
}
