FROM public.ecr.aws/lambda/nodejs:16

ENV PORT 3000

EXPOSE ${PORT}

COPY .env* package*.json /var/task/

RUN npm ci --omit=dev

COPY build/ /var/task/

CMD [ "server.handler" ]
