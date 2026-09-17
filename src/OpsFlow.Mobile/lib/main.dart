import 'package:flutter/material.dart';

import 'models/ticket.dart';
import 'services/opsflow_api.dart';

void main() => runApp(const OpsFlowApp());

class OpsFlowApp extends StatelessWidget {
  const OpsFlowApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
        title: 'OpsFlow Mobile',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(colorSchemeSeed: const Color(0xFF4F46E5), useMaterial3: true),
        home: const TicketPage(),
      );
}

class TicketPage extends StatefulWidget {
  const TicketPage({super.key});

  @override
  State<TicketPage> createState() => _TicketPageState();
}

class _TicketPageState extends State<TicketPage> {
  final api = OpsFlowApi();
  late Future<List<Ticket>> tickets;

  @override
  void initState() {
    super.initState();
    tickets = api.getTickets();
  }

  void refresh() => setState(() => tickets = api.getTickets());

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(
          title: const Text('OpsFlow'),
          actions: [IconButton(onPressed: refresh, icon: const Icon(Icons.refresh))],
        ),
        body: FutureBuilder<List<Ticket>>(
          future: tickets,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snapshot.hasError) {
              return Center(child: Text('No se pudo conectar con OpsFlow\n${snapshot.error}'));
            }
            final items = snapshot.data ?? const <Ticket>[];
            if (items.isEmpty) return const Center(child: Text('No hay tickets asignados.'));
            return RefreshIndicator(
              onRefresh: () async => refresh(),
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: items.length,
                itemBuilder: (context, index) => TicketCard(ticket: items[index], onChanged: refresh),
              ),
            );
          },
        ),
      );
}

class TicketCard extends StatelessWidget {
  const TicketCard({required this.ticket, required this.onChanged, super.key});

  final Ticket ticket;
  final VoidCallback onChanged;

  @override
  Widget build(BuildContext context) => Card(
        margin: const EdgeInsets.only(bottom: 12),
        child: ListTile(
          contentPadding: const EdgeInsets.all(16),
          title: Text(ticket.title, style: const TextStyle(fontWeight: FontWeight.bold)),
          subtitle: Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Text('${ticket.description}\n${ticket.assignee ?? 'Sin técnico asignado'}'),
          ),
          trailing: DropdownButton<TicketStatus>(
            value: ticket.status,
            underline: const SizedBox.shrink(),
            items: TicketStatus.values.map((status) => DropdownMenuItem(value: status, child: Text(status.name))).toList(),
            onChanged: (status) async {
              if (status == null || status == ticket.status) return;
              await OpsFlowApi().updateStatus(ticket.id, status);
              onChanged();
            },
          ),
        ),
      );
}
