local HttpService = game:GetService("HttpService")
local Config = require(script.Parent.Config)
local TradeUtil = require(script.Parent.TradeUtil)

local function confirmDeposit(depositId)
  HttpService:RequestAsync({
    Url = Config.API_URL .. "/api/bot/deposit-confirm",
    Method = "POST",
    Headers = {
      ["Content-Type"] = "application/json",
      ["x-bot-secret"] = Config.BOT_SECRET,
    },
    Body = HttpService:JSONEncode({ depositId = depositId }),
  })
end

-- Hook trade accept: map in-game trade to pending deposit by trade_code / user
local function onTradeAccepted(depositId)
  if TradeUtil.acceptTrade() then
    confirmDeposit(depositId)
  end
end

return {
  onTradeAccepted = onTradeAccepted,
}
