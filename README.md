# Meu Projeto

# 📢 ATENÇÃO:

### src/config deve conter o arquivo de configuração do google pra autenticar a aplicação, nesse formato:

- "type": "service_account",
- "project_id": "your-project-id",
- "private_key_id": "your-private-key-id",
- "private_key": "-----BEGIN PRIVATE KEY-----\n<YOUR_PRIVATE_KEY>\n-----END PRIVATE KEY-----\n",
- "client_email": "your-client-email",
- "client_id": "your-client-id",
- "auth_uri": "https://accounts.google.com/o/oauth2/auth",
- "token_uri": "https://oauth2.googleapis.com/token",
- "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
- "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-client-email",
- "universe_domain": "googleapis.com"

### O arquivo .env da aplicação deve conter

- GEMINI_API_KEY=google-key
- GOOGLE_APPLICATION_CREDENTIALS=caminho-pro-src-config/gemini-id.json

## Como iniciar a aplicação?

- docker-compose up

### ROTA /upload 🚩

#### body :

- "image": BASE64STRING
- "customer_code": STRING,
- "measure_datetime": DATETIMESTRING,
- "measure_type": "WATER" | "GAS"

### ROTA /confirm 🚩

#### body :

- "measure_uuid": STRING
- "confirmed_value": NUMBER,

### ROTA /"customer-code"/list?measure_type="WATER"|"GAS"

### ROTA /image/"image-url" 🚩

### 📢 Dúvidas sobre o projeto? Está faltando alguma chave de autenticação?

- Só me chamar no whatsapp, email ou linkedin, vou responder rapidamente!
- (82)998073039
- joaumvictor.oficial@gmail.com
- https://www.linkedin.com/in/victorfausto/

### Notas:

- A aplicação chegou pra mim no inicio da semana, pensei em fazer no sábado e domingo, mas só me deram até sexta a noite pra terminar e entregar, corri no tempo livre da semana pra fazer oq dava mas faltaram ajustes como o filtro measure_type da ultima rota e a rota estática das imagens que eram detalhes, enfim, subi a correção sábado e domingo pra não perder o teste por essas besteiras, a semana foi corrida e não deu tempo de dar esse retoque até sexta! Valeu!
