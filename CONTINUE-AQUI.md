# TotemLab — projeto editável

Este pacote contém o site publicado em https://totemlab-experience.albert7pereira.chatgpt.site/.

## Abrir em outro chat
Anexe este ZIP e peça: "Extraia o projeto, leia CONTINUE-AQUI.md e continue editando o TotemLab."

## Executar
A pasta dist é a versão completa e atual. Não precisa de npm nem de compilação.
Execute `python -m http.server 8000 --directory dist` e abra http://localhost:8000.
Para editar o configurador, abra /configurador.html.

## Arquivos
- dist/index.html: página publicada.
- dist/site.js e dist/unified.js: comportamento do site.
- dist/site.css e dist/unified.css: aparência.
- dist/configurador.html: renderizador WebGL e dados do modelo.
- dist/configurator-ui.js/css: interface e modo Explorar 3D.
- dist/ar-models: modelos GLB com o banner de hambúrguer/batatas atualizado.
- src e build-site.py: fontes históricas e integração. Não execute build-site.py sem revisar: algumas melhorias atuais estão diretamente em dist e podem ser sobrescritas. Edite dist como fonte atual.

## Publicação
O pacote está preparado para publicar uma cópia em outra conta usando Sites ou hospedagem estática. .openai/hosting.json contém apenas static.directory=dist, sem identidade do site original.
Editar e publicar NO MESMO endereço requer permissão de editor concedida pelo proprietário na plataforma; este ZIP não concede acesso à conta nem ao domínio original.

## Estado e requisitos
Paleta: laranja #ff5a1f, bege, preto e branco, sem gradientes. Classic como modelo principal. Preservar modelos Slim e Classic, simulação de pedidos e comprovante demonstrativo, configuração de materiais/cores e visualização no ambiente.
A seção de scroll gira Slim e Classic. O configurador tem botão Explorar 3D, zoom, movimento e centralização. Gestos ainda requerem testes em celular real.
Vídeos de pessoas usando os totens ainda pendentes: o vídeo anteriormente enviado era uma captura da animação do site. Não afirmar que existem filmagens reais.
Prévia do Classic foi substituída pelo modelo GLB com banner atualizado. Verificar miniaturas remanescentes em assets/classic.png.
Nenhuma credencial, histórico de chat ou acesso de publicação acompanha o pacote.
