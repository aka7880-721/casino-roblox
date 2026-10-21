local HttpService = game:GetService("HttpService")
local Config = require(script.Parent.Config)

local function request(method, path, body)
  local url = Config.API_URL .. path
  local payload = body and HttpService:JSONEncode(body) or nil
  return HttpService:RequestAsync({
    Url = url,
    Method = method,
    Headers = {
      ["Content-Type"] = "application/json",
      ["x-bot-secret"] = Config.BOT_SECRET,
    },
    Body = payload,
  })
end

while true do
  pcall(function()
    request("POST", "/api/bot/heartbeat")
    local pending = request("GET", "/api/bot/pending")
    if pending.Success then
      local data = HttpService:JSONDecode(pending.Body)
      print("[AdoptLuck Bot] pending deposits", #(data.deposits or {}), "withdrawals", #(data.withdrawals or {}))
    end
  end)
  task.wait(Config.POLL_INTERVAL)
end
