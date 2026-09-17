import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/ticket.dart';

class OpsFlowApi {
  OpsFlowApi({http.Client? client, String? baseUrl})
      : _client = client ?? http.Client(),
        baseUrl = baseUrl ?? _defaultBaseUrl;

  static const _defaultBaseUrl = bool.fromEnvironment('dart.library.html')
      ? 'http://127.0.0.1:5188'
      : 'http://10.0.2.2:5188';

  final http.Client _client;
  final String baseUrl;

  Future<List<Ticket>> getTickets() async {
    final response = await _client.get(Uri.parse('$baseUrl/api/tickets'));
    if (response.statusCode != 200) throw Exception('Could not load tickets');
    final data = jsonDecode(response.body) as List<dynamic>;
    return data.map((item) => Ticket.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<void> updateStatus(String id, TicketStatus status) async {
    final response = await _client.patch(
      Uri.parse('$baseUrl/api/tickets/$id/status'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'status': status.name[0].toUpperCase() + status.name.substring(1)}),
    );
    if (response.statusCode != 200) throw Exception('Could not update ticket');
  }
}
