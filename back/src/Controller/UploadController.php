<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class UploadController extends AbstractController
{
    #[Route('/api/upload', name: 'api_upload', methods: ['POST', 'OPTIONS'])]
    public function upload(Request $request): JsonResponse
    {
        $file = $request->files->get('file');

        if (!$file) {
            return new JsonResponse(['error' => 'Aucun fichier reçu'], Response::HTTP_BAD_REQUEST);
        }

        // Dossier cible : public/uploads




         
        $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads';

        // Nom unique pour éviter les collisions
        $filename = uniqid() . '.' . $file->guessExtension();

        try {
            $file->move($uploadDir, $filename);
        } catch (FileException $e) {
            return new JsonResponse(['error' => 'Erreur lors de l\'upload du fichier'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // URL publique vers le fichier
        $publicUrl = '/uploads/' . $filename;

        return new JsonResponse([
            'url' => $publicUrl,
            'filename' => $file->getClientOriginalName(),
        ], Response::HTTP_OK);
    }
}
