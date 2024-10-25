### Descrição

#### Geração do arquivo mongo-keyfile

Para os nós funcionar é necessário gerar um arquivo de senha com a permissão 999:999, isso está no arquivo setup-pass.sh

```shell
chmod +x ./setup-pass.sh && ./setup-pass.sh
```

Devido precisar da permissão 999:999, talvez seja necessário rodar o setup com o comando sudo.

#### Mongo failover teste

Para acessar algum container do mongo

```shel
docker exec -it mongo-primary mongosh -u root -p example
```

Para verificar se o replica set já foi iniciado e mostrar o seu status

```shell
rs.status()
```

Para iniciar o replica set

```shell
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo-primary:27017" },
    { _id: 1, host: "mongo-secondary-1:27017" },
    { _id: 2, host: "mongo-secondary-2:27017" }
  ]
})
```
