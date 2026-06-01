// Aguardar o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    
    // FORMULÁRIO DE CADASTRO (POST)
    const form = document.getElementById('contatoForm');
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Evita o recarregamento da página
        
        // Capturar os dados do formulário
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        
        // Criar objeto contato
        const contato = {
            nome: nome,
            telefone: telefone
        };
        
        try {
            // Enviar via POST para o backend
            const response = await fetch('/api/agenda', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contato)
            });
            
            if (response.ok) {
                const resultado = await response.json();
                exibirMensagem(`✅ Contato de ${resultado.nome} cadastrado com sucesso!`, 'success');
                form.reset(); // Limpar formulário
                
                // EXTRA: Atualizar automaticamente a lista após cada cadastro (critério extra do PDF)
                await listarContatos();
            } else {
                exibirMensagem('❌ Erro ao cadastrar contato!', 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            exibirMensagem('❌ Erro de conexão com o servidor!', 'error');
        }
    });
    
    // BOTÃO LISTAR CONTATOS (GET)
    const btnListar = document.getElementById('btnListar');
    
    btnListar.addEventListener('click', async function() {
        await listarContatos();
    });
    
    // Função para listar contatos via GET
    async function listarContatos() {
        const respostaDiv = document.getElementById('resposta');
        
        try {
            // Chamar a rota GET
            const response = await fetch('/api/agenda');
            
            if (response.ok) {
                // Converter JSON retornado em objeto JavaScript
                const contatos = await response.json();
                
                // Exibir os dados na tela
                if (contatos.length === 0) {
                    respostaDiv.innerHTML = '<p class="info">📭 Nenhum contato cadastrado ainda.</p>';
                } else {
                    // Criar lista HTML (usando ul e li como sugerido no PDF)
                    let html = '<ul class="lista-contatos">';
                    contatos.forEach((contato, index) => {
                        html += `
                            <li>
                                <strong>${contato.nome}</strong><br>
                                <span class="telefone">📞 ${contato.telefone}</span>
                            </li>
                        `;
                    });
                    html += '</ul>';
                    respostaDiv.innerHTML = html;
                }
            } else {
                respostaDiv.innerHTML = '<p class="error">❌ Erro ao carregar contatos!</p>';
            }
        } catch (error) {
            console.error('Erro no GET:', error);
            respostaDiv.innerHTML = '<p class="error">❌ Erro de conexão ao listar contatos!</p>';
        }
    }
    
    // Função auxiliar para exibir mensagens
    function exibirMensagem(mensagem, tipo) {
        const respostaDiv = document.getElementById('resposta');
        respostaDiv.innerHTML = `<div class="${tipo}">${mensagem}</div>`;
        
        // Limpar mensagem após 3 segundos se não for lista
        setTimeout(() => {
            if (!respostaDiv.querySelector('ul')) {
                respostaDiv.innerHTML = 'Aguardando...';
            }
        }, 3000);
    }
});