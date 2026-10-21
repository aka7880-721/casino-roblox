--[[
  TradeUtil — wrappers around Adopt Me trade remotes.
  Replace Remote paths with current game remotes from your executor/decompiler.
]]
local TradeUtil = {}

function TradeUtil.getTradeSession()
  -- TODO: return active trade session from Adopt Me UI
  return nil
end

function TradeUtil.acceptTrade()
  -- TODO: fire accept remote when trade window confirms deposit pets
  return true
end

function TradeUtil.sendTradeToPlayer(username, petIds)
  -- TODO: initiate outbound trade for withdrawal fulfillment
  return true
end

return TradeUtil
