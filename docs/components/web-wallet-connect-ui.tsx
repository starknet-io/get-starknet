import { useState } from "react";

export function WebWalletConnectUi() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!window.opener) {
      alert("No parent window found – cannot complete login");
      return;
    }

    window.opener.postMessage(
      {
        type: "webwallet:credentials",
        id: "web-wallet",
        payload: { username, password },
      },
      window.location.origin,
    );

    window.close();
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center !bg-gray-100">
      <form
        onSubmit={submit}
        autoComplete="off"
        className="!bg-white border !border-gray-300 rounded p-6 flex flex-col gap-4 min-w-[300px] shadow-lg">
        <h2 className="text-lg font-semibold text-center !text-gray-900">
          Web Wallet Login
        </h2>
        <input
          required
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
          autoSave="off"
          name="webwallet:username"
          className="border !border-gray-300 p-2 rounded !bg-white !text-gray-900"
        />
        <input
          required
          type="password"
          placeholder="Password"
          name="webwallet:password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          autoSave="off"
          className="border !border-gray-300 p-2 rounded !bg-white !text-gray-900"
        />
        <button
          type="submit"
          className="w-full !bg-blue-600 text-white py-2 rounded !hover:bg-blue-700">
          Connect
        </button>
      </form>
    </div>
  );
}
