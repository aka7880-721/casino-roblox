local HttpService = game:GetService("HttpService")
local Config = require(script.Parent.Config)
local TradeUtil = require(script.Parent.TradeUtil)

local function confirmWithdraw(withdrawalId)
  HttpService:RequestAsync({
    Url = Config.API_URL .. "/api/bot/withdraw-confirm",
    Method = "POST",
    Headers = {
      ["Content-Type"] = "application/json",
      ["x-bot-secret"] = Config.BOT_SECRET,
    },
    Body = HttpService:JSONEncode({ withdrawalId = withdrawalId }),
  })
end

local function processWithdrawal(entry)
  local ok = TradeUtil.sendTradeToPlayer(entry.username, entry.pet_ids)
  if ok then
    confirmWithdraw(entry.id)
  end
end

return {
  processWithdrawal = processWithdrawal,
}
