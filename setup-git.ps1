# Script para configurar Git no projeto
$gitPath = "C:\Users\24011693\AppData\Local\Programs\Git\bin\git.exe"

# Navegar para o diretório do projeto
Set-Location "C:\Users\24011693\Desktop\agenda hotel"

# Inicializar repositório Git
& $gitPath init

# Configurar usuário (substitua pelos seus dados)
& $gitPath config user.name "Seu Nome"
& $gitPath config user.email "seu.email@exemplo.com"

# Adicionar arquivos do projeto
& $gitPath add .

# Fazer commit inicial
& $gitPath commit -m "Initial commit: Agenda Hotel project"

Write-Host "Git configurado com sucesso!"
Write-Host "Repositório inicializado em: $(Get-Location)"

