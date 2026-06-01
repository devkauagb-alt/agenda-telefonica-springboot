package com.example.agendaTelefonica.controller;

import com.example.agendaTelefonica.model.Pessoa;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/agenda")
public class AgendaController {

    // Lista que simula um banco de dados
    private List<Pessoa> contatos = new ArrayList<>();


    // POST - Cadastrar contato
    @PostMapping
    public Pessoa cadastrar(@RequestBody Pessoa pessoa) {

        contatos.add(pessoa);

        return pessoa;
    }


 
}