http://172.240.1.1:3002/api/v1/bots/xxxxxx/converse/SmACacZPzeBRnjj4F:jxbzswq4lesjkf4k74xleq

# Message:
curl -X POST -H "Content-Type: application/json" -d '{"action":"message","actionData":{"type":"text","text":"Ola\n*como vai?* Ronaldo"},"sessionId":"SmACacZPzeBRnjj4F"}' http://localhost:3001/api/apps/public/6a8e6b6c-7a25-47c9-94e8-5af5075981ad/incoming

# Transfer (HANDOVER)
curl -X POST -H "Content-Type: application/json" -d '{"action":"handover","actionData":{"targetDepartment":"Department name"},"sessionId":"SmACacZPzeBRnjj4F"}' http://localhost:3001/api/apps/public/6a8e6b6c-7a25-47c9-94e8-5af5075981ad/incoming

# Close chat
curl -X POST -H "Content-Type: application/json" -d '{"action":"close-chat","sessionId":"SmACacZPzeBRnjj4F"}' http://localhost:3001/api/apps/public/6a8e6b6c-7a25-47c9-94e8-5af5075981ad/incoming



    CLOSE_CHAT = 'close-chat',
    HANDOVER = 'handover',
    MESSAGE = 'message',
