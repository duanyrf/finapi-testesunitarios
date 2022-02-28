# Dicas

## Dependências para instalar

**dependencies**

**dev dependencies**
- jest
- @types/jest
- ts-jest
- dotenv

## Configuração de dependências

**dotEnv**
1. Importar no topo do arquivo de configuração da autenticação (_config/auth.ts_): `import 'dotenv/config'`;

Agora já podemos utilizar as variáveis de ambiente do arquivo _.env_.

**Jest**
1. Rodar `yarn jest --init`;
1. Em _jest.config.ts_ alterar propriedade _preset_ para `preset: "ts-jest"`, permitindo executar os testes em Typescript;
1. ALterar _testMatch_ para procurar por arquivos _.spec.ts_ em todas os diretórios, utilizando a expressão `"**/*.spec.ts"`;
1. Alterar a propriedade _bail_ para _true_, para instruir o Jest a interromper os testes em caso de falha;

Agora é possível criar e executar nossos testes corretamente.
