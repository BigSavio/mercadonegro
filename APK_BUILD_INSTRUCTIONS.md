# PDV Reporter — Instruções para Gerar APK

## Opção 1: Gerar APK na sua máquina (Recomendado)

### Pré-requisitos:
- Node.js 18+ instalado
- Android Studio instalado
- Java 17+ instalado

### Passos:

1. **Extraia o código-fonte:**
```bash
tar -xzf pdv-reporter-source.tar.gz
cd pdv-reporter
```

2. **Instale as dependências:**
```bash
npm install
# ou
pnpm install
```

3. **Faça o build:**
```bash
npm run build
```

4. **Gere o APK:**
```bash
npx cap add android
npx cap sync android
cd android
./gradlew assembleRelease
```

5. **O APK estará em:**
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## Opção 2: Usar Serviço Online (Mais Fácil)

Se você não quer instalar tudo localmente, pode usar:

### EAS Build (Expo):
1. Crie conta em https://expo.dev
2. Use `eas build --platform android`

### Capacitor Cloud Build:
1. Acesse https://capacitorjs.com/docs/guides/ci-cd
2. Configure no GitHub Actions

---

## Opção 3: Usar a PWA (Sem APK)

O app funciona perfeitamente como PWA:
- Acesse pelo navegador do celular
- Instale como app (Chrome: Menu → Instalar app)
- Funciona offline
- Sincroniza quando volta online

---

## Estrutura do Projeto:

```
pdv-reporter/
├── client/              # Código React (frontend)
├── server/              # Código Node.js (backend)
├── android/             # Projeto Android (gerado automaticamente)
├── package.json         # Dependências
└── capacitor.config.json # Configuração do Capacitor
```

---

## Troubleshooting:

**Erro: "Java 17 required"**
- Instale Java 17: https://www.oracle.com/java/technologies/downloads/

**Erro: "Android SDK not found"**
- Instale Android Studio: https://developer.android.com/studio

**Erro: "gradle command not found"**
- Use o gradle wrapper: `./gradlew` em vez de `gradle`

---

## Suporte:

Se tiver dúvidas, entre em contato!
